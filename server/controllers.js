// const model = require('./models.js');
const pool = require('./db');

const products = (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;

  pool.query(`SELECT *, cast(default_price as varchar) FROM products WHERE id BETWEEN $1 AND $2`, [(page * count) - count, page * count])
    .then((response) => {
      res.status(200).send(response.rows);
    })
    .catch((error) => console.error(error))
}

const productInfo = (req, res) => {
  let product_id = req.params.product_id;
  console.log(product_id)

  // pool.query(`SELECT * FROM products WHERE id=$1`, [product_id])
  //   .then( (response) => {
  //     let obj = response.rows[0];
  //     obj.default_price = String(obj.default_price);
  //     return obj;
  //   })
  //   .then( (obj) => {
  //     pool.query(`SELECT feature, value FROM features WHERE product_id=$1`, [product_id])
  //       .then( (response) => {
  //         obj.features = response.rows;
  //         res.status(200).send(obj);
  //       })
  //   })
  //   .catch( (error) => console.error(error))

  pool.query(`SELECT * FROM products p INNER JOIN features f ON p.id = f.product_id WHERE p.id=$1`, [product_id])
    .then((response) => {
      let obj = response.rows;
      obj = obj.reduce((acc, next) => {
        let singleFeature = {};
        for (let key in next) {
          if (key === "feature" || key === "value") {
            console.log('hitting')
            singleFeature[key] = next[key]
          }
          if (key === "id") {
            continue;
          }
          acc[key] = next[key]
        }
        acc.features = acc.features || [];
        acc.features.push(singleFeature)
        return acc;
      }, {})
      res.status(200).send(obj);
    })
    .catch( (error) => {
      res.status(404).send(error);
    })
}

const productStyles = (req, res) => {
  let product_id = req.params.product_id;
  // pool.query(`SELECT json_build_object(
  //                     'style_id', s.id,
  //                     'name', s.name,
  //                     'original_price', s.original_price,
  //                     'sale_price', s.sale_price,
  //                     'default?', s.default_style,
  //                     'photos', json_agg(json_build_object('thumbnail_url', p.thumbnail_url,
  //                     'url', p.url))

  //                     )
  //             FROM styles s
  //             INNER JOIN photos p
  //             ON s.id = p.styleid
  //             WHERE s.product_id=$1
  //             GROUP BY s.id
  //             `, [product_id])
  //   .then( (response) => {
  //     res.send(response.rows)
  //   })

  pool.query(`SELECT s.id AS style_id, s.name, s.sale_price, s.original_price, s.default_style, p.thumbnail_url, p.url, skus.id as skus_id, skus.size, skus.quantity FROM styles s INNER JOIN photos p ON s.id = p.styleid INNER JOIN skus ON skus.styleid = s.id WHERE s.product_id=$1`, [product_id])
    .then((response) => {
      let obj = {product_id: product_id};
      obj.results = response.rows;

      let photosSeen = [];
      let photosArray = [];
      let photos = response.rows.forEach( (row) => {
        if (photosSeen.indexOf(row.thumbnail_url) === -1) {
          let newObj = {style_id: row.style_id, thumbnail_url: row.thumbnail_url, url: row.url}
          photosSeen.push(row.thumbnail_url)
          photosArray.push(newObj)
        }
      })
      // console.log(photosArray)

      let skusObj = {};
      response.rows.forEach( (row) => {
        if (skusObj[row.skus_id] === undefined) {
          skusObj[row.skus_id] = {}
          skusObj[row.skus_id].style_id = row.style_id;
          skusObj[row.skus_id].quantity = row.quantity;
          skusObj[row.skus_id].size = row.size;
        }
      })
      // console.log(skusObj)
      let found = [];
      let descs = response.rows.map( (row, index, array) => {
        if (found.indexOf(row.style_id) === -1) {
          found.push(row.style_id);
          row = JSON.parse(JSON.stringify(row));
          delete row.thumbnail_url;
          delete row.url;
          delete row.skus_id;
          delete row.size;
          delete row.quantity;
          return row;
        }
      }).filter( (element) => {
        return element;
      })

      descs.forEach( (desc) => {
        desc.photos = [];
        photosArray.forEach( (photo) => {
          if (photo.style_id === desc.style_id) {
            let obj = {};
            obj.thumbnail_url = photo.thumbnail_url;
            obj.url = photo.url;
            desc.photos.push(obj)
          }
        })
        desc.skus = {};
        for (let key in skusObj) {
          if (skusObj[key].style_id === desc.style_id) {
            desc.skus[key] = {};
            desc.skus[key].quantity = skusObj[key].quantity;
            desc.skus[key].size = skusObj[key].size;
          }
        }
      })
      // console.log(descs)
      res.send(descs)
    })
    .catch( (error) => {
      res.status(404).send(error)
    })

  // pool.query(`SELECT id AS "style_id", name, original_price, sale_price, default_style AS "default?" FROM styles WHERE product_id=$1`, [product_id])
  //   .then( (response) => {
  //     let obj = {product_id: product_id}
  //     obj.result = response.rows;
  //     return obj;
  //   })
  //   .then( (obj) => {
  //     // let style_ids = obj.result.reduce( (acc, next) => {
  //     //   acc.push(next.style_id);
  //     //   return acc;
  //     // }, [])
  //     // console.log(style_ids)
  //     // pool.query(`SELECT * FROM photos WHERE styleId = ANY ($1)`, [style_ids])
  //     //   .then( (response) => {
  //     //     obj.photos = response.rows;
  //     //     res.send(obj)
  //     //   })
  //     // pool.query(`SELECT * FROM photos WHERE styleId IN (SELECT id FROM styles WHERE product_id=$1)`, [product_id])
  //     //     .then( (response) => {
  //     //     obj.photos = response.rows;
  //     //     res.send(obj)
  //     //   })
  //     pool.query(`SELECT * FROM styles s INNER JOIN photos p ON s.id = p.styleId WHERE p.styleId IN (SELECT id FROM styles WHERE product_id=$1)`, [product_id])
  //     .then( (response) => {
  //     obj.photos = response.rows;
  //     res.send(obj)
  //   })
  //   })
  //   .catch( (error) => console.error(error))
}

module.exports = {
  products,
  productInfo,
  productStyles
}
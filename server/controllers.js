// const model = require('./models.js');
const pool = require('./db');

const products = (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;

  pool.query(`SELECT *, cast(default_price as varchar) FROM products WHERE id BETWEEN $1 AND $2`, [(page * count) - count, page * count])
    .then( (response) => {
      res.status(200).send(response.rows);
    })
    .catch( (error) => console.error(error))
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
    .then( (response) => {
      let obj = response.rows;
      obj = obj.reduce( (acc, next) => {
        let singleFeature = {};
        acc.features = acc.features || [];
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
        acc.features.push(singleFeature)
        return acc;
      }, {})
      res.status(200).send(obj)
    })
}

const productStyles = (req, res) => {
  let product_id = req.params.product_id;

  pool.query(`SELECT id AS "style_id", name, original_price, sale_price, default_style AS "default?" FROM styles WHERE product_id=$1`, [product_id])
    .then( (response) => {
      let obj = {product_id: product_id}
      obj.result = response.rows;
      return obj;
    })
    .then( (obj) => {
      let style_ids = obj.result.reduce( (acc, next) => {
        acc.push(next.style_id);
        return acc;
      }, [])
      console.log(style_ids)
      pool.query(`SELECT url, thumbnail_url FROM photos WHERE styleId = ANY ($1)`, [style_ids])
        .then( (response) => {
          console.log(response.rows)
        })

    })
    .catch( (error) => console.error(error))
}

module.exports = {
  products,
  productInfo,
  productStyles
}
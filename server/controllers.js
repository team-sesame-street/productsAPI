const pool = require('./db');

const products = (req, res) => {
  let page = req.query.page || 1;
  let count = req.query.count || 5;

  pool.query(`SELECT *, cast(default_price as varchar) FROM products WHERE id BETWEEN $1 AND $2`, [(page * count) - count, page * count])
    .then((response) => res.status(200).send(response.rows))
    .catch((error) => res.status(404).send(error))
}

const productInfo = (req, res) => {
  let product_id = req.params.product_id;
  pool.query(`SELECT json_build_object(
                      'id', p.id,
                      'name', p.name,
                      'slogan', p.slogan,
                      'description', p.description,
                      'category', p.category,
                      'default_price', p.default_price,
                      'features', json_agg(json_build_object(
                                          'feature', f.feature,
                                          'value', f.value)
                                          )
                      )
              FROM products p
              INNER JOIN features f
              ON p.id = f.product_id
              WHERE p.id=$1
              GROUP BY p.id`, [product_id])
    .then( (response) => {
      res.send(response.rows[0].json_build_object)
    })
    .catch( (error) => {
      res.status(404).send(error)
    })
}

const productStyles = (req, res) => {
  let product_id = req.params.product_id;
  pool.query(`SELECT json_build_object(
                      'style_id', s.id,
                      'name', s.name,
                      'original_price', s.original_price,
                      'sale_price', s.sale_price,
                      'default?', s.default_style,
                      'photos', json_agg(DISTINCT jsonb_build_object('thumbnail_url', p.thumbnail_url,
                      'url', p.url)),
                      'skus', json_object_agg(skus.id, json_build_object(
                                              'quantity', skus.quantity,
                                              'size', skus.size
                      ))
                      )
              FROM styles s
              LEFT JOIN photos p
              ON s.id = p.styleid
              LEFT JOIN skus
              ON s.id = skus.styleid
              WHERE s.product_id=$1
              GROUP BY s.id
              `, [product_id])
    .then( (response) => {
      let mapped = response.rows.map( (row) => {
        return row.json_build_object;
      })
      res.send(mapped)
    })
    .catch( (error) => {
      res.send(404).send(error)
    })
}

const productRelated = (req, res) => {
  let product_id = req.params.product_id;
  pool.query(`SELECT array(SELECT related_product_id FROM related WHERE current_product_id=$1)`, [product_id])
      .then((response) => {
        res.status(200).send(response.rows[0].array)
      })
      .catch( (error) => res.status(404).send(error))
}

module.exports = {
  products,
  productInfo,
  productStyles,
  productRelated
}
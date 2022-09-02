/* eslint-disable quotes */
/* eslint-disable camelcase */
const pool = require('./db');

// const products = (req, res) => {
//   const page = req.query.page || 1;
//   const count = req.query.count || 5;

//   pool.query(`SELECT *, cast(default_price as varchar) FROM products WHERE id BETWEEN $1 AND $2`, [(page * count) - count, page * count])
//     .then((response) => res.status(200).send(response.rows))
//     .catch((error) => res.status(404).send(error));
// };
const getProducts = async (page, count) => {
  const query = {
    name: 'get-products',
    text: `SELECT *, cast(default_price as varchar) FROM products WHERE id BETWEEN $1 AND $2`,
    values: [(page * count) - count, page * count],
  };

  const response = await pool.query(query);

  return response.rows;
};

const getProductInfo = async (productId) => {
  const query = {
    name: 'get-product-info',
    text: `SELECT json_build_object(
      'id', p.id,
      'name', p.name,
      'slogan', p.slogan,
      'description', p.description,
      'category', p.category,
      'default_price', CAST (p.default_price AS text),
      'features', json_agg(json_build_object(
                          'feature', f.feature,
                          'value', f.value)
                          )
      )
      FROM products p
      INNER JOIN features f
      ON p.id = f.product_id
      WHERE p.id=$1
      GROUP BY p.id`,
    values: [productId],
  };

  const response = await pool.query(query);
  console.log('response is...', response)

  return response.rows[0].json_build_object;

  // pool.query(`SELECT json_build_object(
  //                     'id', p.id,
  //                     'name', p.name,
  //                     'slogan', p.slogan,
  //                     'description', p.description,
  //                     'category', p.category,
  //                     'default_price', CAST (p.default_price AS text),
  //                     'features', json_agg(json_build_object(
  //                                         'feature', f.feature,
  //                                         'value', f.value)
  //                                         )
  //                     )
  //             FROM products p
  //             INNER JOIN features f
  //             ON p.id = f.product_id
  //             WHERE p.id=$1
  //             GROUP BY p.id`, [product_id])
  //   .then((response) => {
  //     res.send(response.rows[0].json_build_object);
  //   })
  //   .catch((error) => {
  //     res.status(404).send(error);
  //   });
};

const productStyles = (req, res) => {
  const { product_id } = req.params;
  pool.query(`SELECT json_build_object(
                      'style_id', s.id,
                      'name', s.name,
                      'original_price', CAST (s.original_price AS text),
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
    .then((response) => {
      const mapped = response.rows.map((row) => row.json_build_object);
      res.send(mapped);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
};

const productRelated = (req, res) => {
  const { product_id } = req.params;
  pool.query(`SELECT array(SELECT related_product_id FROM related WHERE current_product_id=$1)`, [product_id])
    .then((response) => {
      res.status(200).send(response.rows[0].array);
    })
    .catch((error) => res.status(404).send(error));
};

module.exports = {
  getProducts,
  getProductInfo,
  productStyles,
  productRelated,
};

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS styles;
DROP TABLE IF EXISTS skus;
DROP TABLE IF EXISTS features;
DROP TABLE IF EXISTS photos;

CREATE TABLE IF NOT EXISTS products (
  id int NOT NULL,
  name varchar,
  slogan varchar,
  description varchar,
  category varchar,
  default_price int,
  PRIMARY KEY (id)
);

\copy products FROM '/Users/un1ty/hr/productsAPI/product.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS styles (
  id int NOT NULL,
  product_id int,
  name varchar,
  sale_price int,
  original_price int,
  default_style boolean,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

\copy styles FROM '/Users/un1ty/hr/productsAPI-data/styles.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS skus (
  id int NOT NULL,
  styleId int,
  size varchar,
  quantity int,
  PRIMARY KEY (id),
  FOREIGN KEY (styleId) REFERENCES styles(id)
);

\copy skus FROM '/Users/un1ty/hr/productsAPI-data/skus.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS features (
  id int NOT NULL,
  product_id int,
  feature varchar,
  value varchar,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

\copy features FROM '/Users/un1ty/hr/productsAPI-data/features.csv' DELIMITER ',' CSV HEADER;

CREATE TABLE IF NOT EXISTS photos (
  id int NOT NULL,
  styleId int,
  thumbnail_url varchar,
  url varchar,
  PRIMARY KEY (id),
  FOREIGN KEY (styleId) REFERENCES styles(id)
)

\copy photos FROM '/Users/un1ty/hr/productsAPI-data/photos.csv' DELIMITER ',' CSV HEADER;
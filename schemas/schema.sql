DROP DATABASE IF EXISTS productsAPI;
CREATE DATABASE productsAPI;

\c productsapi;

CREATE TABLE IF NOT EXISTS products (
  id int NOT NULL,
  name varchar,
  slogan varchar,
  description varchar,
  category varchar,
  default_price int,
  PRIMARY KEY (id)
);

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

CREATE TABLE IF NOT EXISTS skus (
  id int NOT NULL,
  styleId int,
  size varchar,
  quantity int,
  PRIMARY KEY (id),
  FOREIGN KEY (styleId) REFERENCES styles(id)
);

CREATE TABLE IF NOT EXISTS features (
  id int NOT NULL,
  product_id int,
  feature varchar,
  value varchar,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS photos (
  id int NOT NULL,
  styleId int,
  thumbnail_url varchar,
  url varchar,
  PRIMARY KEY (id),
  FOREIGN KEY (styleId) REFERENCES styles(id)
)
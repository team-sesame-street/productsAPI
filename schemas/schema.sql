CREATE DATABASE productsAPI;

\connect productsAPI;

CREATE TABLE products (
  product_id int NOT_NULL,
  product_name varchar(255),
  product_slogan varchar(255),
  product_description varchar(255),
  product_category varchar(255),
  default_price int,
  PRIMARY KEY (product_id)
)

CREATE TABLE features (
  id int NOT_NULL AUTO_INCREMENT,
  product_id int NOT_NULL,
  feature varchar(255),
  feature_value varchar(255),
  PRIMARY KEY (id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
)

CREATE TABLE related_products (
  id int NOT_NULL AUTO_INCREMENT,
  main_product_id int,
  related_product_id int,
  PRIMARY KEY (id),
  FOREIGN KEY (main_product_id) REFERENCES products(product_id),
  FOREIGN KEY (related_product_id) REFERENCES products(product_id)
)

CREATE TABLE styles (
  style_id int NOT_NULL,
  product_id int,
  style_name varchar(255),
  original_price int,
  sale_price int,
  style_default? boolean,
  PRIMARY KEY (style_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
)

CREATE TABLE photos (
  id int NOT_NULL AUTO_INCREMENT,
  style_id int,
  thumbnail_url varchar(255),
  photo_url varchar(255),
  PRIMARY KEY (id),
  FOREIGN KEY (style_id) REFERENCES styles(style_id)
)

CREATE TABLE skus (
  id int NOT_NULL AUTO_INCREMENT,
  style_id int,
  sku_id int,
  quantity int,
  size varchar(255),
  PRIMARY KEY (id),
  FOREIGN KEY (style_id) REFERENCES styles(style_id)
)

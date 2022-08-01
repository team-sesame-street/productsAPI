const request = require("supertest")("http://localhost:3000");
const expect = require("chai").expect;

describe("GET request to products", () => {
  let error, response;

  before(function(done) {
    request.get("/products").end((err, res) => {
      error = err, response = res;
      done();
    })
  })

  it('returns a status code of 200', () => {
    expect(response.status).to.eql(200);

  });
  it('returns product with id 1 ', () => {
    let product_id_1 = {
      "id": 1,
      "name": "Camo Onesie",
      "slogan": "Blend in to your crowd",
      "description": "The So Fatigues will wake you up and fit you in. This high energy camo will have you blending in to even the wildest surroundings.",
      "category": "Jackets",
      "default_price": "140"
  }
    expect(response.body[0]).to.eql(product_id_1);

  })
  it('returns results array of products', () => {
    expect(response.body).to.exist;
  })
});
import { faker } from "@faker-js/faker";
const apiUrl = Cypress.env("apiUrl");
let token;
context("PUT /orders/add - Ajouter un produit au pannier", () => {
  before(() => {
    cy.request("POST", apiUrl + "/login", {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      // Stockez le token dans la variable
    });
  });

  it("Devrait ajouter un produit au panier avec success", () => {
    cy.request({
      method: "PUT",
      url: apiUrl + "/orders/add",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: {
        product: 6,
        quantity: 1,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body)
        .to.have.property("orderLines")
        .and.to.be.an("array");
      response.body.orderLines.forEach((line) => {
        expect(line)
          .to.have.property("quantity")
          .and.to.be.a("number")
          .and.to.be.greaterThan(0);
      });
    });
  });
});

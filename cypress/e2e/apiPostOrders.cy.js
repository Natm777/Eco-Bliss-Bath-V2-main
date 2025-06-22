import { faker } from "@faker-js/faker";
const apiUrl = Cypress.env("apiUrl");
let token;
context("POST /Crée/Valide la commande en cours", () => {
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

  it("Devrait créer une commande avec success", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/orders",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: {
        firstname: "Test",
        lastname: "Test",
        address: "155 rue test",
        zipCode: "75001",
        city: "Paris",
      },
    }).then((response) => {
      // Vos assertions pour votre test
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("firstname", "Test");
      expect(response.body).to.have.property("orderLines");
      expect(response.body.orderLines).to.be.an("array");
    });
  });
});

import { faker } from "@faker-js/faker";
const apiLogin = `${Cypress.env("apiUrl")}/login`;
const apiUrl = Cypress.env("apiUrl");
let token;

context("POST /login", () => {
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

  it("devrait obtenir les informations de l'utilisateur", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/me",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },

      failOnStatusCode: true,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.include.keys(
        "id",
        "email",
        "roles",
        "password",
        "firstname",
        "lastname"
      );
      expect(response.body.id).to.be.a("number");
      expect(response.body.email).to.be.a("string");
      expect(response.body.password).to.be.a("string");
      expect(response.body.firstname).to.be.a("string");
      expect(response.body.lastname).to.be.a("string");
      expect(response.body.roles).to.be.an("array");
    });
  });
});

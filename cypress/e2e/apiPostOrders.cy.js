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
        Accept: "application/json",
      },
      body: {
        firstname: "Test",
        lastname: "Test",
        address: "155 rue test",
        zipCode: "75001",
        city: "Paris",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include({
        firstname: "Test",
        lastname: "Test",
        zipCode: "75001",
        city: "Paris",
        validated: true,
      });
      expect(response.body)
        .to.have.property("orderLines")
        .and.to.be.an("array");
    });
  });
});

context("POST /orders sans commande", () => {
  it("Devrait retourner 404 et un message explicite s'il n'y a pas de commande en cours", () => {
    const fakeEmail = faker.internet.email();
    const fakeFirstName = faker.person.firstName();
    const fakeLastName = faker.person.lastName();
    const fakePassword = faker.internet.password();

    // Étape 1 : créer un utilisateur pour obtenir un token
    cy.request({
      method: "POST",
      url: apiUrl + "/register",
      body: {
        email: fakeEmail,
        firstname: fakeFirstName,
        lastname: fakeLastName,
        plainPassword: {
          first: fakePassword,
          second: fakePassword,
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      // Étape 2 : login pour obtenir un token valide
      cy.request("POST", apiUrl + "/login", {
        username: fakeEmail,
        password: fakePassword,
      }).then((response) => {
        expect(response.status).to.eq(200);
        const token = response.body.token;

        // Étape 3 : test POST /orders
        cy.request({
          method: "POST",
          url: apiUrl + "/orders",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
          if (typeof response.body === "string") {
            expect(response.body).to.include("Pas de commande en cours");
          }
        });
      });
    });
  });
});

context("POST /orders sans être connecté", () => {
  it("Devrait retourner 500 car l'utilisateur n'est pas connecté", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/orders",
      headers: {
        Accept: "application/json",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(500);
      });
  });
});

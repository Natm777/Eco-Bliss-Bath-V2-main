import { faker } from "@faker-js/faker";
const apiUrl = Cypress.env("apiUrl");
context("GET /orders sans authentification", () => {
  it("should return 401 KO", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.include("JWT Token not found");
    });
  });
});

let token;

context("GET /orders avec authentification", () => {
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

  it("Devrait retourner un 200 avec un property orderLines", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      headers: {
        Authorization: "Bearer " + token, // Utilisez le token ici
      },
      body: {
        //s’il y a un body
      },
    }).then((response) => {
      // Vos assertions pour votre test
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("orderLines");
    });
  });
});
context("GET /orders sans commande", () => {
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
    }).then((resRegister) => {
      expect(resRegister.status).to.eq(200);

      // Étape 2 : login pour obtenir un token valide
      cy.request("POST", apiUrl + "/login", {
        username: fakeEmail,
        password: fakePassword,
      }).then((resLogin) => {
        expect(resLogin.status).to.eq(200);
        const token = resLogin.body.token;

        // Étape 3 : test GET /orders
        cy.request({
          method: "GET",
          url: apiUrl + "/orders",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
          if (typeof response.body === "string") {
            expect(response.body).to.include("Aucune commande en cours");
          }
        });
      });
    });
  });
});

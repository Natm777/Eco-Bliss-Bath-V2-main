import { faker } from "@faker-js/faker";
// Récupère l'URL de l'API depuis les variables d'environnement Cypress.
const apiUrl = Cypress.env("apiUrl");

// Premier contexte : test de la route GET /orders sans authentification.
context("GET /orders sans authentification", () => {
  // Test : la requête doit échouer avec un code 401 si l'utilisateur n'est pas authentifié.
  it("should return 401 KO", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      failOnStatusCode: false, // Permet de capturer la réponse même si le code est une erreur.
    }).then((response) => {
      expect(response.status).to.eq(401); // Vérifie le code de statut.
      expect(response.body.message).to.include("JWT Token not found"); // Vérifie le message d'erreur.
      cy.log("Response body:", response.body); // Affiche le corps de la réponse dans les logs.
    });
  });
});

let token;

// Deuxième contexte : test de la route GET /orders avec authentification.
context("GET /orders avec authentification", () => {
  // Avant tous les tests, on effectue une connexion pour obtenir un token.
  before(() => {
    cy.request("POST", apiUrl + "/login", {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie que la connexion est réussie.
      token = response.body.token; // Stocke le token pour les requêtes suivantes.
      // Stockez le token dans la variable
    });
  });

  // Test : la requête doit réussir et retourner un objet contenant la propriété orderLines.
  it("Devrait retourner un 200 avec un property orderLines", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      headers: {
        Authorization: "Bearer " + token, // Utilise le token d'authentification.
      },
      body: {
        //s’il y a un body
      },
    }).then((response) => {
      // Assertions pour le test
      expect(response.status).to.eq(200); // Vérifie le code de statut.
      expect(response.body).to.have.property("orderLines"); // Vérifie la présence de la propriété orderLines.
    });
  });
});

// Troisième contexte : test de la route GET /orders pour un utilisateur sans commande en cours.
context("GET /orders sans commande", () => {
  // Test : la requête doit retourner un code 404 et un message explicite si aucune commande n'existe.
  it("Devrait retourner 404 et un message explicite s'il n'y a pas de commande en cours", () => {
    // Génère des données factices pour créer un nouvel utilisateur.
    const fakeEmail = faker.internet.email();
    const fakeFirstName = faker.person.firstName();
    const fakeLastName = faker.person.lastName();
    const fakePassword = faker.internet.password();

    // Étape 1 : création d'un utilisateur pour obtenir un token.
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
      expect(resRegister.status).to.eq(200); // Vérifie que l'inscription est réussie.

      // Étape 2 : connexion avec le nouvel utilisateur pour obtenir un token.
      cy.request("POST", apiUrl + "/login", {
        username: fakeEmail,
        password: fakePassword,
      }).then((resLogin) => {
        expect(resLogin.status).to.eq(200); // Vérifie que la connexion est réussie.
        const token = resLogin.body.token; // Récupère le token.

        // Étape 3 : test de la route GET /orders avec le nouvel utilisateur.
        cy.request({
          method: "GET",
          url: apiUrl + "/orders",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          failOnStatusCode: false, // Permet de capturer la réponse même si le code est une erreur.
        }).then((response) => {
          expect(response.status).to.eq(404); // Vérifie que le code de statut est 404.
          if (typeof response.body === "string") {
            expect(response.body).to.include("Aucune commande en cours"); // Vérifie le message d'erreur.
          }
        });
      });
    });
  });
});

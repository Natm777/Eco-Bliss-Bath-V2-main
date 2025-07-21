import { faker } from "@faker-js/faker";
const apiUrl = Cypress.env("apiUrl");
let token;

// Contexte de test pour la création d'une commande après ajout d'un produit au panier
context("POST /Orders avec commande", () => {
  // Avant tous les tests, on effectue une connexion pour obtenir un token
  before(() => {
    cy.request("POST", apiUrl + "/login", {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie que la connexion est réussie
      token = response.body.token; // Stocke le token pour les requêtes suivantes
      // Stockez le token dans la variable
    });
  });

  // Test : ajout d'un produit au panier
  it("Devrait ajouter un produit au panier", () => {
    // Étape 1 : Ajouter un produit au panier
    cy.request({
      method: "PUT",
      url: apiUrl + "/orders/add",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: {
        product: 6, // ou un produit connu en stock
        quantity: 1,
      },
    }).then((addResponse) => {
      expect(addResponse.status).to.eq(200); // Vérifie que l'ajout au panier est réussi
    });
  });

  // Test : création d'une commande avec succès
  it("Devrait créer une commande avec succès", () => {
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
      expect(response.status).to.eq(200); // Vérifie que la commande est créée avec succès
      expect(response.body).to.include({
        firstname: "Test",
        lastname: "Test",
        zipCode: "75001",
        city: "Paris",
        validated: true,
      }); // Vérifie que les informations de la commande sont correctes
      expect(response.body)
        .to.have.property("orderLines")
        .and.to.be.an("array"); // Vérifie que la commande contient des lignes de commande
    });
  });
});

// Contexte de test pour la création d'une commande sans panier existant
context("POST /orders sans commande", () => {
  // Test : la requête doit retourner 404 si aucune commande n'est en cours
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
      expect(response.status).to.eq(200); // Vérifie que l'inscription est réussie

      // Étape 2 : login pour obtenir un token valide
      cy.request("POST", apiUrl + "/login", {
        username: fakeEmail,
        password: fakePassword,
      }).then((response) => {
        expect(response.status).to.eq(200); // Vérifie que la connexion est réussie
        const token = response.body.token;

        // Étape 3 : test POST /orders
        cy.request({
          method: "POST",
          url: apiUrl + "/orders",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          failOnStatusCode: false, // Permet de capturer la réponse même si le code est une erreur
        }).then((response) => {
          expect(response.status).to.eq(404); // Vérifie que le serveur retourne une erreur 404
          if (typeof response.body === "string") {
            expect(response.body).to.include("Pas de commande en cours"); // Vérifie le message d'erreur retourné
          }
        });
      });
    });
  });
});

const apiUrl = Cypress.env("apiUrl");
import { faker } from "@faker-js/faker";
let token;

// Contexte de test pour la récupération de la liste des avis via GET /reviews
context("GET / Reviews", () => {
  it("Devrait retourner un 200 avec la liste des avis", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/reviews",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie que la requête est réussie
      expect(response.body).to.be.an("array"); // Vérifie que la réponse est un tableau
      expect(response.body.length).to.be.greaterThan(0); // Vérifie qu'il y a au moins un avis

      // Vérifie les propriétés de chaque avis
      response.body.forEach((review) => {
        expect(review).to.include.keys(
          "date",
          "title",
          "comment",
          "rating",
          "author"
        );
        expect(review.date).to.be.a("string");
        expect(review.title).to.be.a("string");
        expect(review.comment).to.be.a("string");
        expect(review.rating).to.be.a("number");
        expect(review.author).to.be.an("object");
        expect(review.author).to.include.keys("firstname", "lastname", "email");
      });
    });
  });
});

// Contexte de test pour la création d'un avis après authentification
context("POST /Login to create a review", () => {
  // Avant tous les tests, on effectue une connexion pour obtenir un token
  before(() => {
    cy.request("POST", apiUrl + "/login", {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie la réussite de la connexion
      token = response.body.token; // Stocke le token pour les requêtes suivantes
      // Stockez le token dans la variable
    });
  });

  // Test : création d'un avis avec des données valides
  it("Devrait créer un avis avec succès", () => {
    const reviewData = {
      title: faker.lorem.sentence(),
      comment: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }),
    };

    cy.request({
      method: "POST",
      url: apiUrl + "/reviews",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      body: reviewData,
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie que la création est réussie
      expect(response.body).to.be.an("object"); // Vérifie que la réponse est un objet
      expect(response.body).to.include.keys(
        "id",
        "date",
        "title",
        "comment",
        "author"
      );

      expect(response.body.author).to.be.an("object");
      expect(response.body.author).to.include.keys("id", "email");
    });
  });
});

// Contexte de test pour la gestion d'une erreur 400 lors de l'envoi de données invalides
context("POST/ erreur 400 donnés invalides", () => {
  // Avant tous les tests, on effectue une connexion pour obtenir un token
  before(() => {
    cy.request("POST", apiUrl + "/login", {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie la réussite de la connexion
      token = response.body.token;

      // Stockez le token dans la variable
    });
  });

  // Test : envoi d'un avis avec des données invalides (rating trop élevé)
  it("Devrait retourner une erreur 400 si les données sont invalides", () => {
    const invalidReview = {
      comment: faker.lorem.paragraph(),
      rating: 50,
    };

    cy.request({
      method: "POST",
      url: apiUrl + "/reviews",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      body: invalidReview,
      failOnStatusCode: false, // Permet de capturer l'erreur 400
    }).then((response) => {
      expect(response.status).to.eq(400); // Vérifie que le serveur retourne une erreur 400
      if (typeof response.body === "string") {
        expect(response.body).to.include("Erreur dans les données envoyées");
      }
    });
  });
});

// Contexte de test pour la création d'un avis sans authentification
context("POST /review sans authentification", () => {
  // Test : la requête doit échouer avec une erreur 401 si l'utilisateur n'est pas authentifié
  it("should return Error: Unauthorized", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/reviews",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401); // Vérifie que le serveur retourne une erreur 401
      if (typeof response.body === "string") {
        expect(response.body).to.include("Unauthorized");
      }
    });
  });
});

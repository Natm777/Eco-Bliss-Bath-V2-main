// Récupération de l'URL de l'API depuis les variables d'environnement Cypress.
const apiUrl = Cypress.env("apiUrl");
// Déclaration d'une variable pour stocker le token d'authentification.
let token;

// Définition d'un contexte de test pour la route PUT /orders/add (ajout d'un produit au panier).
context("PUT /orders/add - Ajouter un produit au panier", () => {
  // Avant tous les tests, authentification de l'utilisateur pour obtenir un token.
  before(() => {
    cy.request("POST", `${apiUrl}/login`, {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      // Vérifie que la connexion est réussie (code 200).
      expect(response.status).to.eq(200);
      // Stocke le token d'authentification pour les requêtes suivantes.
      token = response.body.token;
    });
  });

  // Avant chaque test, on vide le panier pour garantir un état propre.
  beforeEach(() => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/orders`,
      headers: {
        Authorization: "Bearer " + token,
      },
      failOnStatusCode: false, // Permet de ne pas échouer si le panier est vide (404).
    }).then((res) => {
      // Récupère les articles du panier (tableau ou vide).
      const cartItems = Array.isArray(res.body.orderLines)
        ? res.body.orderLines
        : []; //Extraire la liste des produits depuis orderLines

      // Si le panier contient des articles, on les supprime un à un.
      if (cartItems.length > 0) {
        cartItems.forEach((item) => {
          cy.request({
            method: "DELETE",
            url: `${apiUrl}/orders/${item.product.id}/delete`,
            headers: {
              Authorization: "Bearer " + token,
            },
            failOnStatusCode: false, // Ignore les erreurs de suppression.
          });
        });
      }
    });
  });

  // Test : ajout d'un produit au panier avec succès.
  it("Devrait ajouter un produit au panier avec succès", () => {
    const productId = 5;

    cy.request({
      method: "PUT",
      url: `${apiUrl}/orders/add`,
      headers: {
        Authorization: "Bearer " + token,
      },
      body: {
        product: productId,
        quantity: 1,
      },
    }).then((response) => {
      // Vérifie que la requête est réussie.
      expect(response.status).to.eq(200);
      // Vérifie que la réponse contient un tableau 'orderLines'.
      expect(response.body)
        .to.have.property("orderLines")
        .and.to.be.an("array");

      // Vérifie que chaque orderline a une quantité supérieure à 0.
      response.body.orderLines.forEach((line) => {
        expect(line)
          .to.have.property("quantity")
          .and.to.be.a("number")
          .and.to.be.greaterThan(0);
      });
    });
  });

  // Test : refus d'ajout d'un produit en rupture de stock (stock 0 ou négatif).
  it("ne devrait pas permettre d’ajouter un produit en rupture de stock (0 ou négatif)", () => {
    const productId = 3; // Produit avec stock négatif

    cy.request({
      method: "GET",
      url: `${apiUrl}/products/${productId}`,
      headers: {
        Authorization: "Bearer " + token,
      },
      failOnStatusCode: false,
    }).then((res) => {
      // Vérifie que le stock est bien à 0 ou négatif.
      const stock = res.body.availableStock;
      expect(stock).to.be.at.most(0);

      // Tente d'ajouter le produit au panier.
      cy.request({
        method: "PUT",
        url: `${apiUrl}/orders/add`,
        headers: {
          Authorization: "Bearer " + token,
        },
        body: {
          product: productId,
          quantity: 1,
        },
        failOnStatusCode: false, // Permet de capturer l'erreur sans faire échouer le test.
      }).then((res) => {
        // Vérifie que le serveur refuse la requête (code différent de 200).
        expect(res.status).to.not.eq(200);
      });
    });
  });

  // Test : refus d'ajout d'une quantité supérieure au stock disponible.
  it("ne devrait pas permettre d’ajouter une quantité supérieure à la disponibilité", () => {
    const productId = 10;
    cy.request({
      method: "GET",
      url: `${apiUrl}/products/${productId}`,
      headers: {
        Authorization: "Bearer " + token,
      },
      failOnStatusCode: false,
    }).then((res) => {
      // Vérifie que le stock est positif.
      const stock = res.body.availableStock;
      expect(stock).to.be.a("number").and.to.be.greaterThan(0);

      const excessiveQuantity = stock + 2; // Définit une quantité excessive (supérieure au stock).

      // Tente d'ajouter cette quantité au panier.
      cy.request({
        method: "PUT",
        url: `${apiUrl}/orders/add`,
        headers: {
          Authorization: "Bearer " + token,
        },
        body: {
          product: productId,
          quantity: excessiveQuantity,
        },
        failOnStatusCode: false,
      }).then((res) => {
        // Vérifie que le serveur refuse la requête (code différent de 200).
        expect(res.status).to.not.eq(200);
      });
    });
  });

  // Test : refus d'ajout d'une quantité négative.
  it("ne devrait pas permettre l’ajout d’une quantité négative", () => {
    const productId = 9;

    cy.request({
      method: "PUT",
      url: `${apiUrl}/orders/add`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        product: productId,
        quantity: -3,
      },
      failOnStatusCode: false,
    }).then((res) => {
      // Vérifie que le serveur retourne une erreur (code >= 400).
      expect(res.status).to.be.gte(400);
    });
  });
});

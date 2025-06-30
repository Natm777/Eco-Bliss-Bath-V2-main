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
        // Vérifie que chaque ligne de commande a une propriété "quantity"
        expect(line)
          .to.have.property("quantity")
          .and.to.be.a("number")
          .and.to.be.greaterThan(0);
      });
    });
  });

  it("Ajouter un produit en rupture de stock", () => {
    // Récupération du stock réel du produit
    const productId = 7;

    cy.request(`${apiUrl}/products/${productId}`).then((response) => {
      expect(response.status).to.eq(200);
      const stock = response.body.availableStock;

      // Vérification de l'état initial
      expect(stock).to.be.a("number");
      expect(stock).to.eq(0); // ce test est fait sur un produit en rupture de stock

      // Tentative d'ajouter une quantité supérieure au stock
      cy.request({
        method: "PUT",
        url: `${apiUrl}/orders/add`,
        headers: {
          Authorization: "Bearer " + token,
        },
        body: {
          product: productId,
          quantity: stock + 1, // volontairement au-dessus
        },
        failOnStatusCode: false, // important pour ne pas que Cypress bloque sur l’erreur
      }).then((response) => {
        expect(response.status).to.be.gte(400);
      });
    });
  });

  it("Ajout d’une quantité supérieure à la disponibilité", () => {
    const productId = 10;

    // Récupération du stock réel du produit
    cy.request(`${apiUrl}/products/${productId}`).then((response) => {
      expect(response.status).to.eq(200);
      const stock = response.body.availableStock;

      // S'assure que le stock est raisonnable pour le test
      expect(stock).to.be.a("number");

      const excessiveQuantity = stock + 100;

      // Tentative d'ajout au panier avec une quantité excessive
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
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});

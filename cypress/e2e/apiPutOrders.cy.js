import { faker } from "@faker-js/faker";

const apiUrl = Cypress.env("apiUrl");
let token;

context("PUT /orders/add - Ajouter un produit au panier", () => {
  // Authentification unique
  before(() => {
    cy.request("POST", `${apiUrl}/login`, {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
    });
  });

  // Vider le panier avant chaque test
  beforeEach(() => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/orders`,
      headers: {
        Authorization: "Bearer " + token,
      },
      failOnStatusCode: false, // ✅ Ajout ici pour gérer les 404 silencieusement
    }).then((res) => {
      const cartItems = Array.isArray(res.body) ? res.body : [];

      if (cartItems.length > 0) {
        cartItems.forEach((item) => {
          cy.request({
            method: "DELETE",
            url: `${apiUrl}/orders/${item.product.id}/delete`,
            headers: {
              Authorization: "Bearer " + token,
            },
            failOnStatusCode: false,
          });
        });
      }
    });
  });

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

  it("ne devrait pas permettre d’ajouter un produit en rupture de stock (0 ou négatif)", () => {
    const productId = 3; // Sentiments printaniers (stock -8)

    cy.request(`${apiUrl}/products/${productId}`).then((res) => {
      const stock = res.body.availableStock;
      expect(stock).to.be.at.most(0);

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
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.not.eq(200); // Si le serveur renvoie 200, le test échoue
      });
    });
  });

  it("ne devrait pas permettre d’ajouter une quantité supérieure à la disponibilité", () => {
    const productId = 9;

    cy.request(`${apiUrl}/products/${productId}`).then((res) => {
      const stock = res.body.availableStock;
      expect(stock).to.be.a("number").and.to.be.greaterThan(0);

      const excessiveQuantity = stock + 1;

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
        expect(res.status).to.not.eq(200);
      });
    });
  });

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
      expect(res.status).to.be.gte(400);
    });
  });
});

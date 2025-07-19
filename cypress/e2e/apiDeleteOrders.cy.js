import { faker } from "@faker-js/faker";
const apiUrl = Cypress.env("apiUrl");
let token;
let orderLineId;
context("DELETE /orders/{id}/delete - supprimer un produit du panier", () => {
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

      orderLineId = response.body.orderLines[0].id;
      expect(orderLineId).to.be.a("number");
    });
  });

  it("Devrait supprimer un produit du panier avec success", () => {
    cy.request({
      method: "DELETE",
      url: `${apiUrl}/orders/${orderLineId}/delete`,
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      body: {
        //s’il y a un body
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      if (typeof response.body === "string") {
        expect(response.body).to.include("Produit supprimé");
      }
    });
  });
});

context(
  "DELETE /orders/{id}/delete - supprimer un produit du panier inexistante",
  () => {
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

    it("Devrait envoyer un 404 car produit non trouvé", () => {
      const fakeOrderLineId = 999999;
      cy.request({
        method: "DELETE",
        url: `${apiUrl}/orders/${fakeOrderLineId}/delete`,
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
        body: {
          //s’il y a un body
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        if (typeof response.body === "string") {
          expect(response.body).to.include("Produit non trouvé");
        }
      });
    });
  }
);

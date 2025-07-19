import { faker } from "@faker-js/faker";
const apiUrl = Cypress.env("apiUrl");
let token;
let orderLineId;

context(
  "PUT /orders/add - Modifier la quantité d'un produit au pannier",
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

    it("Devrait ajouter un produit au panier avec success", () => {
      cy.request({
        method: "PUT",
        url: apiUrl + "/orders/add",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: {
          product: 9,
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

    it("Devrait modifier la quantité d produit au panier avec success", () => {
      cy.request({
        method: "PUT",
        url: `${apiUrl}/orders/${orderLineId}/change-quantity`,
        headers: {
          Authorization: "Bearer " + token,
        },
        body: {
          quantity: 2,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body)
          .to.have.property("orderLines")
          .and.to.be.an("array");

         const updatedLine = response.body.orderLines.find(
          (line) => line.id === orderLineId
         );
        expect(updatedLine)
          .to.have.property("quantity")
          .and.to.be.a("number")
          .and.to.be.greaterThan(1); // 
      });
    });
  }
);

context(
  "PUT /orders/${orderLineId}/change-quantity ajouter un produit inexistante au pannier",
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
        method: "PUT",
        url: `${apiUrl}/orders/${fakeOrderLineId}/change-quantity`,
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
        body: {
          quantity: 2,
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

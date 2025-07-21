// Ce fichier contient des tests end-to-end Cypress pour l'API de modification de quantité d'un produit dans le panier.

// Récupération de l'URL de l'API depuis les variables d'environnement Cypress.
const apiUrl = Cypress.env("apiUrl");

// Déclaration de variables pour stocker le token d'authentification et l'identifiant de la ligne de commande.
let token;
let orderLineId;

// Premier contexte de test : modification de la quantité d'un produit dans le panier.
context(
  "PUT /orders/add - Modifier la quantité d'un produit au pannier",
  () => {
    // Avant tous les tests, authentification de l'utilisateur pour obtenir un token.
    before(() => {
      cy.request("POST", apiUrl + "/login", {
        username: "test2@test.fr",
        password: "testtest",
      }).then((response) => {
        // Vérifie que la connexion est réussie (code 200).
        expect(response.status).to.eq(200);
        // Stocke le token d'authentification pour les requêtes suivantes.
        token = response.body.token;
      });
    });

    // Test : ajout d'un produit au panier.
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
        // Vérifie que la requête est réussie.
        expect(response.status).to.eq(200);
        // Vérifie que la réponse contient un tableau 'orderLines'.
        expect(response.body)
          .to.have.property("orderLines")
          .and.to.be.an("array");

        // Récupère l'identifiant de la ligne de commande ajoutée.
        orderLineId = response.body.orderLines[0].id;
        // Vérifie que l'identifiant est bien un nombre.
        expect(orderLineId).to.be.a("number");
      });
    });

    // Test : modification de la quantité du produit ajouté au panier.
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
        // Vérifie que la requête est réussie.
        expect(response.status).to.eq(200);
        // Vérifie que la réponse contient un tableau 'orderLines'.
        expect(response.body)
          .to.have.property("orderLines")
          .and.to.be.an("array");

        // Recherche la ligne de commande modifiée dans la réponse.
        const updatedLine = response.body.orderLines.find(
          (line) => line.id === orderLineId
        );
        // Vérifie que la quantité a bien été modifiée (supérieure à 1).
        expect(updatedLine)
          .to.have.property("quantity")
          .and.to.be.a("number")
          .and.to.be.greaterThan(1);
      });
    });
  }
);

// Second contexte de test : tentative de modification de la quantité d'un produit inexistant dans le panier.
context(
  "PUT /orders/${orderLineId}/change-quantity ajouter un produit inexistante au pannier",
  () => {
    // Avant tous les tests, authentification de l'utilisateur pour obtenir un token.
    before(() => {
      cy.request("POST", apiUrl + "/login", {
        username: "test2@test.fr",
        password: "testtest",
      }).then((response) => {
        // Vérifie que la connexion est réussie (code 200).
        expect(response.status).to.eq(200);
        // Stocke le token d'authentification pour les requêtes suivantes.
        token = response.body.token;
      });
    });

    // Test : modification de la quantité d'une ligne de commande inexistante.
    it("Devrait envoyer un 404 car produit non trouvé", () => {
      const fakeOrderLineId = 999999; // Identifiant fictif qui n'existe pas.
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
        failOnStatusCode: false, // Permet de gérer les erreurs HTTP sans faire échouer le test.
      }).then((response) => {
        // Vérifie que le serveur retourne bien une erreur 404.
        expect(response.status).to.eq(404);
        // Vérifie que le message d'erreur contient "Produit non trouvé".
        if (typeof response.body === "string") {
          expect(response.body).to.include("Produit non trouvé");
        }
      });
    });
  }
);
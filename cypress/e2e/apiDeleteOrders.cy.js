
// Récupération de l'URL de l'API depuis les variables d'environnement Cypress.
const apiUrl = Cypress.env("apiUrl");

// Déclaration de variables pour stocker le token d'authentification et l'identifiant de la ligne de commande.
let token;
let orderLineId;

// Premier contexte de test : suppression d'un produit du panier.
context("DELETE /orders/{id}/delete - supprimer un produit du panier", () => {
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
      // Stockez le token dans la variable
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
        product: 6,
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

  // Test : suppression du produit ajouté au panier.
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
      // Vérifie que la requête est réussie.
      expect(response.status).to.eq(200);
      // Vérifie que le message de retour contient "Produit supprimé".
      if (typeof response.body === "string") {
        expect(response.body).to.include("Produit supprimé");
      }
    });
  });
});

// Second contexte de test : tentative de suppression d'un produit inexistant dans le panier.
context(
  "DELETE /orders/{id}/delete - supprimer un produit du panier inexistante",
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
        // Stockez le token dans la variable
      });
    });

    // Test : suppression d'une ligne de commande inexistante.
    it("Devrait envoyer un 404 car produit non trouvé", () => {
      const fakeOrderLineId = 999999; // Identifiant fictif qui n'existe pas.
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
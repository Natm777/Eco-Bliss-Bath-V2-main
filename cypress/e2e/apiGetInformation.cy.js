// Récupération de l'URL de l'API depuis les variables d'environnement Cypress.
const apiUrl = Cypress.env("apiUrl");

// Déclaration d'une variable pour stocker le token d'authentification.
let token;

// Définition d'un contexte de test pour la route POST /login.
context("POST /login", () => {
  // Avant tous les tests de ce contexte, on effectue une requête de connexion pour obtenir un token.
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

  // Test : récupération des informations de l'utilisateur connecté.
  it("devrait obtenir les informations de l'utilisateur", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/me",
      headers: {
        Authorization: "Bearer " + token, // Ajoute le token dans l'en-tête Authorization.
        Accept: "application/json", // Précise le format de réponse attendu.
      },

      failOnStatusCode: true, // Le test échoue si le serveur retourne une erreur HTTP.
    }).then((response) => {
      // Vérifie que la requête est réussie.
      expect(response.status).to.eq(200);
      // Vérifie que la réponse est un objet.
      expect(response.body).to.be.an("object");
      // Vérifie que l'objet contient les clés attendues.
      expect(response.body).to.include.keys(
        "id",
        "email",
        "roles",
        "password",
        "firstname",
        "lastname"
      );
      // Vérifie le type de chaque propriété.
      expect(response.body.id).to.be.a("number");
      expect(response.body.email).to.be.a("string");
      expect(response.body.password).to.be.a("string");
      expect(response.body.firstname).to.be.a("string");
      expect(response.body.lastname).to.be.a("string");
      expect(response.body.roles).to.be.an("array");
    });
  });
});

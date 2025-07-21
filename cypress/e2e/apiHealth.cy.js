// Définition de l'URL de l'endpoint de santé de l'API à partir des variables d'environnement Cypress.
const apiHealth = `${Cypress.env("apiUrl")}/api/health`;

// Bloc de test pour vérifier l'état de santé de l'API via la route GET /api/health.
context("GET /health", () => {
  // Test : la requête doit retourner un code 200 et un statut "ok".
  it("should return 200 OK", () => {
    cy.request("GET", apiHealth).then((response) => {
      expect(response.status).to.eq(200); // Vérifie que le serveur répond avec le code HTTP 200.
      expect(response.body).to.have.property("status", "ok"); // Vérifie que la réponse contient la propriété 'status' avec la valeur 'ok'.
    });
  });
});

describe("Vérification des champs connexion", () => {
  it("devrait vérifier les champs présents sur la page de connexion", () => {
    cy.visit("/#/login");
    cy.get('[data-cy="login-input-username"]').should("exist");
    cy.get('[data-cy="login-input-password"]').should("exist");
    cy.get('[data-cy="login-submit"]').should("exist");
    cy.get('a[href="#/register"]').should("exist"); // Vérifie la présence du lien vers la page d'inscription
  });
});

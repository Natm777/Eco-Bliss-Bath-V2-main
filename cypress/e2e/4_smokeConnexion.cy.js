describe("Vérification des champs connexion", () => {
  // Ce test vérifie la présence des éléments essentiels sur la page de connexion.
  it("devrait vérifier les champs présents sur la page de connexion", () => {
    cy.visit("/#/login"); // Accède à la page de connexion.
    cy.get('[data-cy="login-input-username"]').should("exist"); // Vérifie que le champ email est présent.
    cy.get('[data-cy="login-input-password"]').should("exist"); // Vérifie que le champ mot de passe est présent.
    cy.get('[data-cy="login-submit"]').should("exist"); // Vérifie que le bouton de soumission est présent.
    cy.get('a[href="#/register"]').should("exist"); // Vérifie la présence du lien vers la page d'inscription.
  });
});

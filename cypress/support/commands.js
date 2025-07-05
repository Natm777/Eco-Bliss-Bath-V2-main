// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("checkAddToCartButtonFromProductIndex", (index) => {

  // Attendre que la liste des produits soit bien affichée
  cy.get('[data-cy="product"]', { timeout: 10000 }).should('have.length.at.least', index + 1);

  cy.get('[data-cy="product"]')
    .eq(index)
    .find('[data-cy="product-link"]') // ← adapte si nécessaire
    .click();

  cy.get('[data-cy="detail-product-add"]').should("exist");

  cy.go("back");
  cy.get('[data-cy="product"]', { timeout: 10000 }).should("exist");
});
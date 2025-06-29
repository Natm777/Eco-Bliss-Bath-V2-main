
describe('Connexion utilisateur', () => {
  it('devrait se connecter avec succès', () => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-cart"]').should('be.visible');
  });
});

describe('Connexion utilisateur sans succès', () => {
  it('devrait afficher un message d\'erreur', () => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('wrongpassword');
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="login-errors"]').should('contain', 'Identifiants incorrects');
  });
});
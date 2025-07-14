
describe('Connexion utilisateur', () => {
  beforeEach(() => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-input-username"]').should('exist');
    cy.get('[data-cy="login-input-password"]').should('exist');
  });

  it('devrait se connecter avec succès', () => {
    cy.intercept('POST', '**/login').as('loginRequest');

    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();

    // Attendre la réponse de l’API de login avant de vérifier le DOM
    cy.wait('@loginRequest');

    // Vérifie que la redirection a bien été faite et que l'utilisateur est connecté
    cy.get('[data-cy="nav-link-cart"]').should('be.visible');
  });

  it('devrait afficher un message d\'erreur si mauvais identifiants', () => {
    cy.intercept('POST', '**/login').as('loginRequest');

    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('wrongpassword');
    cy.get('[data-cy="login-submit"]').click();

    cy.wait('@loginRequest');

    cy.get('[data-cy="login-errors"]').should('contain', 'Identifiants incorrects');
  });
});

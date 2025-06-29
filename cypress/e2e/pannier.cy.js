describe('Parcours utilisateur : Connexion et navigation vers Produits', () => {
  before(() => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-cart"]').should('be.visible'); // preuve de succès
  });

  it('devrait naviguer vers la page des produits via le bouton', () => {
    // On clique sur le bouton "Voir les produits"
    cy.contains('button', 'Voir les produits').click();

    // Vérifie qu'on est bien redirigé vers la page produits
    cy.url().should('include', '/#/products');
    cy.get('h1').should('contain', 'Nos produits'); 
    cy.get('[data-cy="product"]').should('be.visible');
    cy.get('[data-cy="product-link"]').first().click();
    cy.url().should('include', '/#/product');
  });

  


});


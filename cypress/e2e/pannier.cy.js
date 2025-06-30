describe("Parcours utilisateur : Connexion et navigation vers Produits", () => {
  beforeEach(() => {
  cy.visit('/#/login');
  cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
  cy.get('[data-cy="login-input-password"]').type("testtest");
  cy.get('[data-cy="login-submit"]').click();
  cy.get('[data-cy="nav-link-cart"]').should("be.visible"); // preuve de succès

  // Ensuite navigue vers produits
  cy.visit('/#/');
  cy.contains("button", "Voir les produits").click();
  cy.url().should("include", "/#/products");
  cy.get('[data-cy="product"]').should("be.visible");
  });

  it("devrait afficher la liste des produits", () => {
    cy.get('[data-cy="product"]').should("have.length.greaterThan", 0);
  });

  it("devrait ouvrir le détail d'un produit", () => {
    cy.get('[data-cy="product-link"]').first().click();
    cy.url().should("include", "/#/product");
  });

  it("devrait ajouter un produit au pannier", () => {
    cy.get('[data-cy="product-link"]').first().click();
    cy.get('[data-cy="detail-product-add"]').click();
    cy.url().should("include", "#/cart");
    cy.get('[data-cy="cart-item"]').should("exist");
  });

});



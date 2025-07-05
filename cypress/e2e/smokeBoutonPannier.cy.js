describe("Vérifier présence bouton 'Ajouter au panier' sur plusieurs fiches produit", () => {
  before(() => {
    cy.visit("/#/login");
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-cart"]').should("be.visible");
    cy.visit("/#/");
    cy.contains("button", "Voir les produits").click();
    cy.url().should("include", "/#/products");
  });


  it("devrait vérifier le bouton sur les 3 premiers produits", () => {

    // Vérifie le bouton des 3 premiers produits
    cy.checkAddToCartButtonFromProductIndex(0);
    cy.checkAddToCartButtonFromProductIndex(1);
    cy.checkAddToCartButtonFromProductIndex(2);
  });
});

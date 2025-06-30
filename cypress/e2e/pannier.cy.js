describe("Parcours utilisateur : Connexion et navigation vers Produits", () => {
  beforeEach(() => {
    cy.visit("/#/login");
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-cart"]').should("be.visible"); // preuve de succès

    // Ensuite navigue vers produits
    cy.visit("/#/");
    cy.contains("button", "Voir les produits").click();
    cy.url().should("include", "/#/products");
    cy.get('[data-cy="product"]').should("be.visible");
  });

  it("devrait afficher la liste des produits", () => {
    cy.get('[data-cy="product"]').should("have.length.greaterThan", 0);
  });

  it("devrait ajouter 'Poussière de lune' au panier", () => {
    cy.contains('[data-cy="product"]', "Poussière de lune")
      .find('[data-cy="product-link"]')
      .click();

    cy.get('[data-cy="detail-product-add"]').click();

    // 🔁 Attente explicite de la redirection + apparition du panier
    cy.url().should("include", "#/cart");

    // ✅ Attend que le conteneur du panier soit visible
    cy.get("#cart-content").should("exist");

    // ✅ Ensuite, vérifie l’élément du produit ajouté
    cy.get('[data-cy="cart-line"]', { timeout: 10000 }).should(
      "contain",
      "Poussière de lune"
    );
  });
});

// Ce test vérifie la présence du bouton "Ajouter au panier" sur plusieurs fiches produit.

// Bloc principal de tests pour la vérification du bouton sur les fiches produit.
describe("Vérifier présence bouton 'Ajouter au panier' sur plusieurs fiches produit", () => {
  // Avant tous les tests, on effectue la connexion et on navigue vers la liste des produits.
  before(() => {
    cy.visit("/#/login"); // Accède à la page de connexion.
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr"); // Saisie de l'email.
    cy.get('[data-cy="login-input-password"]').type("testtest"); // Saisie du mot de passe.
    cy.get('[data-cy="login-submit"]').click(); // Soumission du formulaire de connexion.
    cy.get('[data-cy="nav-link-cart"]').should("be.visible"); // Vérifie que le lien vers le panier est visible.
    cy.visit("/#/"); // Retour à la page d'accueil.
    cy.contains("button", "Voir les produits").click(); // Clique sur le bouton pour afficher les produits.
    cy.url().should("include", "/#/products"); // Vérifie que l'URL correspond à la page des produits.
  });

  // Test : vérifie la présence du bouton "Ajouter au panier" sur les 3 premiers produits de la liste.
  it("devrait vérifier le bouton sur les 3 premiers produits", () => {
    // Vérifie le bouton des 3 premiers produits en utilisant une commande personnalisée.
    cy.checkAddToCartButtonFromProductIndex(0);
    cy.checkAddToCartButtonFromProductIndex(1);
    cy.checkAddToCartButtonFromProductIndex(2);
  });
});

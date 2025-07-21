// Ce fichier contient un test end-to-end Cypress pour vérifier la présence d'une faille XSS (Cross-Site Scripting) dans le formulaire d'avis.

// Définition du bloc de test principal pour la vérification XSS.
describe("Vérifier faille XSS", () => {
  // Avant tous les tests, on effectue la connexion et on navigue vers la page des avis.
  before(() => {
    cy.visit("/#/login"); // Accès à la page de connexion.
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr"); // Saisie de l’email.
    cy.get('[data-cy="login-input-password"]').type("testtest"); // Saisie du mot de passe.
    cy.get('[data-cy="login-submit"]').click(); // Soumission du formulaire de connexion.
    cy.get('[data-cy="nav-link-cart"]').should("be.visible"); // Vérifie que le lien vers le panier est visible.
    cy.visit("/#/reviews"); // Navigation vers la page des avis.
    cy.contains("h1", "Votre avis").should("be.visible"); // Vérifie que le titre de la page est affiché.
    cy.url().should("include", "/#/reviews"); // Vérifie que l’URL correspond à la page des avis.
  });

  // Test : vérifie qu'un script injecté dans un commentaire n'est pas exécuté.
  it("ne doit pas exécuter un script injecté dans un commentaire", () => {
    // Préparation des données à injecter dans le formulaire d'avis.
    const title = "Test XSS123";
    const xssPayload = '<script>alert("XSS")</script>'; // Payload XSS classique.

    // Sélection d'une note via une image (exemple : 4ème étoile).
    cy.get('[data-cy="review-input-rating-images"] img').eq(3).click();

    // Saisie du titre et du commentaire contenant le script malveillant.
    cy.get('[data-cy="review-input-title"]').clear().type(title);
    cy.get('[data-cy="review-input-comment"]').clear().type(xssPayload);
    cy.get('[data-cy="review-submit"]').click(); // Soumission du formulaire.

    // Vérifie qu'aucune alerte JavaScript n'a été déclenchée suite à l'injection.
    cy.on("window:alert", (txt) => {
      // Si cette fonction est appelée, cela signifie qu'un script malveillant a été exécuté.
      throw new Error("Faille XSS détectée via alert: " + txt); // Le test échoue si une alerte est détectée.
    });
  });
});

describe("Vérifier faille XSS", () => {
  before(() => {
    cy.visit("/#/login");
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-cart"]').should("be.visible");
    cy.visit("/#/reviews");
    cy.contains("h1", "Votre avis").should("be.visible");
    cy.url().should("include", "/#/reviews");
  });

  it("ne doit pas exécuter un script injecté dans un commentaire", () => {
    // Injecter une fausse review avec un script
    const title = "Test XSS123";
    const xssPayload = '<script>alert("XSS")</script>';

    cy.get('[data-cy="review-input-rating-images"] img').eq(3).click();

    cy.get('[data-cy="review-input-title"]').clear().type(title);
    cy.get('[data-cy="review-input-comment"]').clear().type(xssPayload);
    cy.get('[data-cy="review-submit"]').click();

    // Vérifie que **aucune alerte JS** n’a été déclenchée
    cy.on("window:alert", (txt) => {
      //le text correspond à l'alert dans la ligne 16
      throw new Error("Faille XSS détectée via alert: " + txt); // Si cette fonction s'exécute, c'est parce qu'un script malveillant a passé à travers et s'est exécuté, le test doit échouer
    });
  });
});

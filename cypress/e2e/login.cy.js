// Ce fichier contient des tests end-to-end Cypress pour vérifier le fonctionnement de la connexion utilisateur.

// Bloc principal de tests pour la fonctionnalité de connexion.
describe("Connexion utilisateur", () => {
  // Avant chaque test, on visite la page de connexion et on vérifie la présence des champs nécessaires.
  beforeEach(() => {
    cy.visit("/#/login"); // Accède à la page de login.
    cy.get('[data-cy="login-input-username"]').should("exist"); // Vérifie que le champ email existe.
    cy.get('[data-cy="login-input-password"]').should("exist"); // Vérifie que le champ mot de passe existe.
  });

  // Test : connexion réussie avec des identifiants valides.
  it("devrait se connecter avec succès", () => {
    cy.intercept("POST", "**/login").as("loginRequest"); // Intercepte la requête POST de login pour pouvoir l'attendre.

    cy.get('[data-cy="login-input-username"]').type("test2@test.fr"); // Saisie de l'email.
    cy.get('[data-cy="login-input-password"]').type("testtest"); // Saisie du mot de passe.
    cy.get('[data-cy="login-submit"]').click(); // Soumission du formulaire.

    // Attendre la réponse de l’API de login avant de vérifier le DOM
    cy.wait("@loginRequest");

    // Vérifie que la redirection a bien été faite et que l'utilisateur est connecté
    cy.get('[data-cy="nav-link-cart"]').should("be.visible"); // Vérifie que le lien vers le panier est visible (signe de connexion réussie).
  });

  // Test : affichage d'un message d'erreur en cas de mauvais identifiants.
  it("devrait afficher un message d'erreur si mauvais identifiants", () => {
    cy.intercept("POST", "**/login").as("loginRequest"); // Intercepte la requête POST de login.

    cy.get('[data-cy="login-input-username"]').type("test2@test.fr"); // Saisie de l'email.
    cy.get('[data-cy="login-input-password"]').type("wrongpassword"); // Saisie d'un mauvais mot de passe.
    cy.get('[data-cy="login-submit"]').click(); // Soumission du formulaire.

    cy.wait("@loginRequest"); // Attend la réponse de l'API.

    cy.get('[data-cy="login-errors"]').should(
      "contain",
      "Identifiants incorrects"
    ); // Vérifie que le message d'erreur s'affiche.
  });
});

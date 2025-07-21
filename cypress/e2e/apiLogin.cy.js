import { faker } from "@faker-js/faker";
// Définition de l'URL de l'endpoint de connexion à partir des variables d'environnement Cypress.
const apiLogin = `${Cypress.env("apiUrl")}/login`;

// Bloc de test pour la route POST /login.
context("POST /login", () => {
  // Test : connexion réussie avec des identifiants valides.
  it("should login successfully", () => {
    cy.request({
      method: "POST",
      url: apiLogin,
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
      failOnStatusCode: true, // Le test échoue si le serveur retourne une erreur HTTP.
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie que la connexion est réussie.
      expect(response.body).to.have.property("token"); // Vérifie que le token est présent dans la réponse.
    });
  });
});

// Test : échec de la connexion avec des identifiants incorrects.
it("should fail to login with wrong credentials", () => {
  const fakeEmail = faker.internet.email(); // Génère un email aléatoire.
  const fakePassword = faker.internet.password(); // Génère un mot de passe aléatoire.

  cy.request({
    method: "POST",
    url: apiLogin,
    body: {
      username: fakeEmail,
      password: fakePassword,
    },
    failOnStatusCode: false, // Permet de capturer la réponse même si le code est une erreur.
  }).then((response) => {
    expect(response.status).to.eq(401); // Vérifie que le serveur retourne une erreur 401.
    expect(response.body.message).to.include("Invalid credentials"); // Vérifie le message d'erreur.
  });
});

// Test : échec de la connexion si le format JSON est invalide.
it("should fail to login if the JSON format is invalid", () => {
  cy.request({
    method: "POST",
    url: apiLogin,
    body: "{badJson:true}", // Envoie un corps de requête JSON invalide.
    headers: {
      "Content-Type": "application/json",
    },
    failOnStatusCode: false, // Permet de capturer la réponse même si le code est une erreur.
  }).then((response) => {
    expect(response.status).to.eq(400); // Vérifie que le serveur retourne une erreur 400.
  });
});

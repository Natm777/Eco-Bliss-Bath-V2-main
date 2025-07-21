import { faker } from "@faker-js/faker";
const apiUrl = Cypress.env("apiUrl");
let token;

// Contexte de test pour la création d'un utilisateur avec succès
context("Creer un utilisateur avec succès", () => {
  it("Devrait créer un utilisateur avec succès", () => {
    // Génère des données factices pour l'utilisateur
    const fakeEmail = faker.internet.email();
    const fakeFirstName = faker.person.firstName();
    const fakeLastName = faker.person.lastName();
    const fakePassword = faker.internet.password();

    // Envoie une requête POST pour créer un nouvel utilisateur
    cy.request({
      method: "POST",
      url: apiUrl + "/register",
      body: {
        email: fakeEmail,
        firstname: fakeFirstName,
        lastname: fakeLastName,
        plainPassword: {
          first: fakePassword,
          second: fakePassword,
        },
      },
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie que la création est réussie
      if (typeof response.body === "string") {
        expect(response.body).to.include(
          "Informations de l'utilisateur inscrit"
        ); // Vérifie que le message de succès est présent
      }
    });
  });
});

// Contexte de test pour la gestion d'une erreur lors de l'envoi de données invalides
context("Erreur dans les donnés envoyés", () => {
  it("Devrait retourner un erreu car donnés invalides", () => {
    // Génère des données invalides pour l'utilisateur (email non valide et mots de passe différents)
    const fakeEmail = faker.lorem.sentence();
    const fakeFirstName = faker.person.firstName();
    const fakeLastName = faker.person.lastName();
    const fakePassword = faker.internet.password();

    // Envoie une requête POST avec des données invalides
    cy.request({
      method: "POST",
      url: apiUrl + "/register",
      body: {
        email: fakeEmail,
        firstname: fakeFirstName,
        lastname: fakeLastName,
        plainPassword: {
          first: "120440", // Mot de passe différent
          second: fakePassword,
        },
      },
      failOnStatusCode: false, // Permet de continuer même si le statut n'est pas 2xx
    }).then((response) => {
      expect(response.status).to.eq(400); // Vérifie que le serveur retourne une erreur 400
      expect(response.body).to.have.property("email"); // Vérifie la présence d'une erreur sur l'email
      expect(response.body.email[0]).to.include("not a valid email"); // Vérifie le message d'erreur sur l'email

      // Vérifie que l'erreur sur plainPassword.first existe
      expect(response.body).to.have.nested.property("plainPassword.first[0]"); //permet de cibler une propriété imbriquée dans un objet complexe.
      expect(response.body.plainPassword.first[0]).to.include("correspondre"); // Vérifie le message d'erreur sur le mot de passe
    });
  });
});

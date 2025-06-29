import { faker } from "@faker-js/faker";
const apiUrl = Cypress.env("apiUrl");
let token;

context("Creer un utilisateur avec succès", () => {
  it("Devrait créer un utilisateur avec succès", () => {
    const fakeEmail = faker.internet.email();
    const fakeFirstName = faker.person.firstName();
    const fakeLastName = faker.person.lastName();
    const fakePassword = faker.internet.password();

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
      expect(response.status).to.eq(200);
      if (typeof response.body === "string") {
        expect(response.body).to.include(
          "Informations de l'utilisateur inscrit"
        );
      }
    });
  });
});

context("Erreur dans les donnés envoyés", () => {
  it("Devrait retourner un erreu car donnés invalides", () => {
    const fakeEmail = faker.lorem.sentence();
    const fakeFirstName = faker.person.firstName();
    const fakeLastName = faker.person.lastName();
    const fakePassword = faker.internet.password();

    cy.request({
      method: "POST",
      url: apiUrl + "/register",
      body: {
        email: fakeEmail,
        firstname: fakeFirstName,
        lastname: fakeLastName,
        plainPassword: {
          first: "120440",
          second: fakePassword,
        },
      },
      failOnStatusCode: false, // Permet de continuer même si le statut n'est pas 2xx
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("email");
      expect(response.body.email[0]).to.include("not a valid email");

      // Vérifie que l'erreur sur plainPassword.first existe
      expect(response.body).to.have.nested.property("plainPassword.first[0]");
      expect(response.body.plainPassword.first[0]).to.include("correspondre");
    });
  });
});

const apiUrl = Cypress.env("apiUrl");
import { faker } from "@faker-js/faker";
let token;

context("GET / Reviews", () => {
  it("Devrait retourner un 200 avec la liste des avis", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/reviews",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);

      response.body.forEach((review) => {
        expect(review).to.include.keys(
          "date",
          "title",
          "comment",
          "rating",
          "author"
        );
        expect(review.date).to.be.a("string");
        expect(review.title).to.be.a("string");
        expect(review.comment).to.be.a("string");
        expect(review.rating).to.be.a("number");
        expect(review.author).to.be.an("object");
        expect(review.author).to.include.keys("firstname", "lastname", "email");
      });
    });
  });
});

context("POST /Login to create a review", () => {
  before(() => {
    cy.request("POST", apiUrl + "/login", {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      // Stockez le token dans la variable
    });
  });

  it("Devrait créer un avis avec succès", () => {
    const reviewData = {
      title: faker.lorem.sentence(),
      comment: faker.lorem.paragraph(),
      rating: faker.number.int({ min: 1, max: 5 }),
    };

    cy.request({
      method: "POST",
      url: apiUrl + "/reviews",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      body: reviewData,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.include.keys(
        "id",
        "date",
        "title",
        "comment",
        "author"
      );

      expect(response.body.author).to.be.an("object");
      expect(response.body.author).to.include.keys("id", "email");
    });
  });
});

context("POST/ erreur 400 donnés invalides", () => {
  before(() => {
    cy.request("POST", apiUrl + "/login", {
      username: "test2@test.fr",
      password: "testtest",
    }).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;

      // Stockez le token dans la variable
    });
  });

  it("Devrait retourner une erreur 400 si les données sont invalides", () => {
    const invalidReview = {
      comment: faker.lorem.paragraph(),
      rating: 50,
    };

    cy.request({
      method: "POST",
      url: apiUrl + "/reviews",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      body: invalidReview,
      failOnStatusCode: false, // Permet de capturer l'erreur 400
    }).then((response) => {
      expect(response.status).to.eq(400);
      if (typeof response.body === "string") {
        expect(response.body).to.include("Erreur dans les données envoyées");
      }
    });
  });
});

context("POST /review sans authentification", () => {
  it("should return Error: Unauthorized", () => {
    cy.request({
      method: "POST",
      url: apiUrl + "/reviews",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      if (typeof response.body === "string") {
        expect(response.body).to.include("Unauthorized");
      }
    });
  });
});

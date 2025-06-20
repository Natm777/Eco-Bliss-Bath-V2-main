const apiUrl = Cypress.env("apiUrl");
context("GET /orders sans authentification", () => {
  it("should return 401 KO", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.include("JWT Token not found");
    });
  });
});

let token;

context("GET /orders avec authentification", () => {
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

  it("Devrait retourner un 200 avec un property orderLines ou un 404 sans property orderLines", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/orders",
      headers: {
        Authorization: "Bearer " + token, // Utilisez le token ici
      },
      body: {
        //s’il y a un body
      },
    }).then((response) => {
      // Vos assertions pour votre test

      if (response.status === 200) {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("orderLines");
      }

      if (response.status === 404) {
        expect(response.status).to.eq(404);
        expect(response.body).not.to.have.property("orderLines");
        expect(response.body.message).to.include("Aucune commande en cours");
      }
    });
  });
});

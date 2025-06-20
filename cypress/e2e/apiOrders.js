import { faker } from '@faker-js/faker'; //n’oubliez jamais l’import, qui est nécessaire


const fakeEmail = faker.internet.email();
const fakePassword = faker.internet.password({ length: 20 });


before(() => {
      cy.request("POST", apiUrl + "/login", {
            "username": fakeEmail,
            "password": fakePassword
      }).then((response) => {
            token = response.body.token;
            // Stockez le token dans la variable
      });
});

it("Votre premier test", () => {
  // Utilisez le token dans votre premier test
  cy.request({
    method: "GET",
    url: apiUrl + "/products",
    headers: {
      "Authorization": "Bearer " + token // Utilisez le token ici
    },
    body: {
      //s’il y a un body
    }
  }).then((response) => {
    // Vos assertions pour votre test
    expect(response.status).to.eq(200);
    expect(response.body).to.have.lengthOf(8);
  });
});




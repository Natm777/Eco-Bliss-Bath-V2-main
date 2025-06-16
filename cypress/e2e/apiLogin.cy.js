import { faker } from "@faker-js/faker";
const apiLogin = "http://localhost:8081/login";
context("POST /login", () => {
  it("should login successfully", () => {
    cy.request({
      method: "POST",
      url: apiLogin,
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },
      failOnStatusCode: true,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("token");
    });
  });
});

it("should fail to login with wrong credentials", () => {
  const fakeEmail = faker.internet.email();
  const fakePassword = faker.internet.password();

  cy.request({
    method: "POST",
    url: apiLogin,
    body: {
      username: fakeEmail,
      password: fakePassword,
    },
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(401);
    expect(response.body.message).to.include("Invalid credentials");
  });
});

it("should fail to login if the JSON format is invalid", () => {
  cy.request({
    method: "POST",
    url: apiLogin,
    body: "{badJson:true}",
    headers: {
      "Content-Type": "application/json",
    },

    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(400);
    expect(response.body.message).to.include("Invalid JSON");
  });
});

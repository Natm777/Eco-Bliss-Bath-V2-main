const apiHealth = `${Cypress.env("apiUrl")}/api/health`;
context("GET /health", () => {
  it("should return 200 OK", () => {
    cy.request("GET", apiHealth).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("status", "ok");
    });
  });
});

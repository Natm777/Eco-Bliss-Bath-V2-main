const apiUrl = Cypress.env("apiUrl");

context("GET / Products", () => {
  it("Devrait retourner un 200 avec la liste des produits", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
    
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);

      response.body.forEach((product) => {
        expect(product).to.include.keys("id", "name", "price", "description");
        expect(product.id).to.be.a("number");
        expect(product.name).to.be.a("string");
        expect(product.price).to.be.a("number");
        expect(product.description).to.be.a("string");
      });
    });
  });
});

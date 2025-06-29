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

context("GET / Products random", () => {
  it("Devrait retourner un 200 avec une liste de 3 produits aleatoires", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products/random",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.equal(3);

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

// Test pour vérifier que les produits aléatoires ne sont pas les mêmes à chaque appel

let firstCall; // À l'extérieur, scope global au fichier

context("GET / Products random qui ne sont pas les mêmes", () => {
  before(() => {
    // Appel 1 : avant les tests
    cy.request(apiUrl + "/products/random").then((response) => {
      firstCall = response.body; // On stocke le résultat
    });
  });

  it("Devrait retourner des produits aléatoires à chaque appel", () => {
    // Appel 2
    cy.request(apiUrl + "/products/random").then((response) => {
      const secondCall = response.body; // On stocke ici en const

      // On compare les deux appels
      expect(JSON.stringify(firstCall)).to.not.equal(
        JSON.stringify(secondCall)
      );
    });
  });
});

let productId; // Variable pour stocker l'ID du produit
context("GET / Récupere les détails d'un produit ", () => {
  before(() => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      productId = response.body[0].id;
    });
  });

  it("Devrait retourner un 200 avec un detail du produit", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products/" + productId,
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.include.keys(
        "id",
        "name",
        "price",
        "description"
      );
      expect(response.body.id).to.be.a("number");
      expect(response.body.name).to.be.a("string");
      expect(response.body.price).to.be.a("number");
      expect(response.body.description).to.be.a("string");
    });
  });

  it("Devrait retourner 404 si le produit n'existe pas", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products/999999",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });
});

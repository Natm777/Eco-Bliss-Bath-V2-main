const apiUrl = Cypress.env("apiUrl");

// Contexte de test pour la route GET /products (liste des produits)
context("GET / Products", () => {
  // Test : la requête doit retourner un code 200 et une liste de produits
  it("Devrait retourner un 200 avec la liste des produits", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie le code de statut
      expect(response.body).to.be.an("array"); // Vérifie que la réponse est un tableau
      expect(response.body.length).to.be.greaterThan(0); // Vérifie qu'il y a au moins un produit

      // Vérifie les propriétés de chaque produit
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

// Contexte de test pour la route GET /products/random (3 produits aléatoires)
context("GET / Products random", () => {
  // Test : la requête doit retourner un code 200 et une liste de 3 produits aléatoires
  it("Devrait retourner un 200 avec une liste de 3 produits aleatoires", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products/random",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie le code de statut
      expect(response.body).to.be.an("array"); // Vérifie que la réponse est un tableau
      expect(response.body.length).to.be.equal(3); // Vérifie qu'il y a exactement 3 produits

      // Vérifie les propriétés de chaque produit
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

// Test pour vérifier que les produits aléatoires changent à chaque appel
let firstCall; // Variable globale pour stocker le premier résultat

context("GET / Products random qui ne sont pas les mêmes", () => {
  // Avant les tests, on effectue un premier appel pour stocker le résultat
  before(() => {
    cy.request(apiUrl + "/products/random").then((response) => {
      firstCall = response.body; // Stocke le résultat du premier appel
    });
  });

  // Test : la liste des produits doit être différente à chaque appel
  it("Devrait retourner des produits aléatoires à chaque appel", () => {
    cy.request(apiUrl + "/products/random").then((response) => {
      const secondCall = response.body; // Stocke le résultat du second appel

      // Compare les deux résultats pour vérifier qu'ils sont différents
      expect(JSON.stringify(firstCall)).to.not.equal(
        JSON.stringify(secondCall)
      );
    });
  });
});

let productId; // Variable pour stocker l'ID d'un produit

// Contexte de test pour la récupération des détails d'un produit
context("GET / Récupere les détails d'un produit ", () => {
  // Avant les tests, on récupère l'ID du premier produit de la liste
  before(() => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products",
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      productId = response.body[0].id; // Stocke l'ID du premier produit
    });
  });

  // Test : la requête doit retourner le détail du produit avec un code 200
  it("Devrait retourner un 200 avec un detail du produit", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products/" + productId,
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200); // Vérifie le code de statut
      expect(response.body).to.be.an("object"); // Vérifie que la réponse est un objet
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

  // Test : la requête doit retourner un code 404 si le produit n'existe pas
  it("Devrait retourner 404 si le produit n'existe pas", () => {
    cy.request({
      method: "GET",
      url: apiUrl + "/products/999999",
      failOnStatusCode: false, // Permet de capturer la réponse même si le code est une erreur
    }).then((response) => {
      expect(response.status).to.eq(404); // Vérifie le code de statut
       });
  });
});
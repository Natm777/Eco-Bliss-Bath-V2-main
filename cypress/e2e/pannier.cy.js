// Ce fichier contient des tests end-to-end Cypress pour vérifier le comportement du panier et la gestion du stock lors de l’ajout de produits.

// Définition du bloc de tests principal pour l’ajout au panier et la vérification du stock.
describe("Ajout au panier et vérification du stock", () => {
  // Variable pour stocker le stock initial du produit testé.
  let initialStock;

  // Avant chaque test, on effectue la connexion et on navigue vers la page des produits.
  beforeEach(() => {
    cy.visit("/#/login"); // Accès à la page de connexion.
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr"); // Saisie de l’email.
    cy.get('[data-cy="login-input-password"]').type("testtest"); // Saisie du mot de passe.
    cy.get('[data-cy="login-submit"]').click(); // Soumission du formulaire de connexion.
    cy.get('[data-cy="nav-link-cart"]').should("be.visible"); // Vérifie que le lien vers le panier est visible.

    // Navigation vers la page d’accueil puis vers la liste des produits.
    cy.visit("/#/"); // Retour à l’accueil.
    cy.contains("button", "Voir les produits").click(); // Clique sur le bouton pour voir les produits.
    cy.url().should("include", "/#/products"); // Vérifie que l’URL correspond à la page produits.
  });

  // Test : ajout d’un produit et vérification de la diminution du stock.
  it("devrait ajouter un produit et vérifier la diminution du stock", () => {
    // Sélection du produit "Poussière de lune" et accès à sa fiche.
    cy.contains('[data-cy="product"]', "Poussière de lune")
      .find('[data-cy="product-link"]')
      .click();

    // Extraction du stock initial affiché sur la fiche produit.
    cy.get('[data-cy="detail-product-stock"]', { timeout: 10000 }).should(
      ($el) => {
        const rawText = $el.text();
        const match = rawText.match(/\d+/);
        expect(match, "Aucun chiffre trouvé dans le texte de stock").to.not.be
          .null;

        initialStock = parseInt(match[0], 10);
        expect(initialStock).to.be.a("number").and.to.be.greaterThan(0);
      }
    );

    // Ajout du produit au panier.
    cy.get('[data-cy="detail-product-add"]').click();

    // Vérification de la redirection vers le panier et de la présence du produit.
    cy.get('[data-cy="nav-link-cart"]').click();
    cy.url().should("include", "#/cart");
    cy.get("#cart-content").should("exist");
    cy.get('[data-cy="cart-line"]').should("contain", "Poussière de lune");

    // Retour sur la fiche produit pour vérifier le stock mis à jour.
    cy.go("back"); // Retour à la fiche produit.
    cy.contains('[data-cy="detail-product-name"]', "Poussière de lune").should(
      "be.visible"
    );
    // Vérifie que le stock a diminué de 1 après l’ajout au panier.
    cy.get('[data-cy="detail-product-stock"]')
      .invoke("text")
      .then((updatedText) => {
        const match = updatedText.match(/\d+/);
        expect(match, "Aucun chiffre trouvé après ajout").to.not.be.null;
        const updatedStock = parseInt(match[0], 10);
        expect(updatedStock).to.eq(initialStock - 1);
      });
  });

  // Test : refus d’ajout au panier si le stock est à 0 ou négatif.
  it("ne devrait pas ajouter un produit au panier si le stock est à 0 ou négatif", () => {
    cy.contains('[data-cy="product"]', "Sentiments printaniers")
      .find('[data-cy="product-link"]')
      .click();

    // Vérifie que le stock affiché est bien à 0 ou négatif.
    cy.get('[data-cy="detail-product-stock"]', { timeout: 10000 }).should(
      ($el) => {
        const rawText = $el.text();
        const match = rawText.match(/-?\d+/);
        expect(match, "Aucun chiffre trouvé dans le texte de stock").to.not.be
          .null;

        const stock = parseInt(match[0], 10);
        expect(stock).to.be.at.most(0); // Vérifie que le stock est 0 ou négatif.
      }
    );

    // Intercepte la requête d’ajout au panier.
    cy.intercept("PUT", "/orders/add").as("addToCart");

    // Tente d’ajouter une quantité au panier.
    cy.get('[data-cy="detail-product-quantity"]').clear().type("1");
    cy.get('[data-cy="detail-product-add"]').click();
    cy.wait("@addToCart"); // Attend la requête PUT.

    // Vérifie qu’on reste sur la fiche produit (pas de redirection vers le panier).
    cy.get('[data-cy="detail-product-name"]', { timeout: 5000 }).should(
      "be.visible"
    );
  });

  // Test : refus d’ajout d’une quantité supérieure au stock disponible.
  it("ne devrait pas permettre d’ajouter une quantité supérieure au stock", () => {
    cy.contains('[data-cy="product"]', "Milkyway")
      .find('[data-cy="product-link"]')
      .click();

    cy.get('[data-cy="detail-product-price"]', { timeout: 10000 }).should(
      "be.visible"
    );
    // Extraction du stock disponible.
    cy.get('[data-cy="detail-product-stock"]', { timeout: 10000 })
      .should(($el) => {
        const stockText = $el.text().trim();
        expect(stockText).to.match(/\d+\s*en stock/);
      })
      .invoke("text")
      .then((text) => {
        const cleaned = text.trim();
        const match = cleaned.match(/\d+/);
        const availableStock = parseInt(match[0], 10);
        const tooMuch = availableStock + 3; // Définit une quantité trop grande.
        cy.get('[data-cy="detail-product-quantity"]')
          .clear()
          .type(tooMuch.toString());

        // Intercepte la requête d’ajout au panier.
        cy.intercept("PUT", "/orders/add").as("addToCart");

        cy.get('[data-cy="detail-product-add"]').click();

        cy.wait("@addToCart");

        // Vérifie qu’on reste sur la fiche produit (pas de redirection).
        cy.get('[data-cy="detail-product-name"]', { timeout: 5000 }).should(
          "be.visible"
        );
      });
  });

  // Test : refus d’ajout d’une quantité négative au panier.
  it("ne devrait pas permettre d’ajouter une quantité négative au panier", () => {
    cy.contains('[data-cy="product"]', "Mousse de rêve")
      .find('[data-cy="product-link"]')
      .click();

    cy.get('[data-cy="detail-product-price"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Saisie d’une quantité négative.
    cy.get('[data-cy="detail-product-quantity"]').clear().type("-10");

    cy.get('[data-cy="detail-product-add"]').click();

    // Vérifie qu’il n’y a pas de redirection vers le panier.
    cy.location("hash").should("not.include", "/cart");

   // Vérifie qu’on reste sur la fiche produit.
    cy.get('[data-cy="detail-product-stock"]').should("exist");
  });
});
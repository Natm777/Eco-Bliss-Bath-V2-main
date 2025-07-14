describe("Ajout au panier et vérification du stock", () => {
  let initialStock;

  beforeEach(() => {
    cy.visit("/#/login");
    cy.get('[data-cy="login-input-username"]').type("test2@test.fr");
    cy.get('[data-cy="login-input-password"]').type("testtest");
    cy.get('[data-cy="login-submit"]').click();
    cy.get('[data-cy="nav-link-cart"]').should("be.visible");

    // Aller à la page produits
    cy.visit("/#/");
    cy.contains("button", "Voir les produits").click();
    cy.url().should("include", "/#/products");
  });

  it("devrait ajouter un produit et vérifier la diminution du stock", () => {
    // Aller à la fiche du produit
    cy.contains('[data-cy="product"]', "Poussière de lune")
      .find('[data-cy="product-link"]')
      .click();

    // Extraire le stock initial affiché
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

    // Ajouter au panier
    cy.get('[data-cy="detail-product-add"]').click();

    // Vérifier redirection vers panier
    cy.get('[data-cy="nav-link-cart"]').click();
    cy.url().should("include", "#/cart");
    cy.get("#cart-content").should("exist");
    cy.get('[data-cy="cart-line"]').should("contain", "Poussière de lune");

    // Retourner sur la fiche produit pour re-vérifier le stock
    cy.go("back"); // ou navigation directe
    cy.contains('[data-cy="detail-product-name"]', "Poussière de lune").should(
      "be.visible"
    );
    // Vérifie que le stock a diminué de 1
    cy.get('[data-cy="detail-product-stock"]')
      .invoke("text")
      .then((updatedText) => {
        const match = updatedText.match(/\d+/);
        expect(match, "Aucun chiffre trouvé après ajout").to.not.be.null;
        const updatedStock = parseInt(match[0], 10);
        expect(updatedStock).to.eq(initialStock - 1);
      });
  });

  it("ne devrait pas ajouter un produit au panier si le stock est à 0", () => {
    cy.contains('[data-cy="product"]', "Extrait de nature")
      .find('[data-cy="product-link"]')
      .click();

    cy.get('[data-cy="detail-product-stock"]', { timeout: 10000 }).should(
      ($el) => {
        const rawText = $el.text();
        const match = rawText.match(/-?\d+/);
        expect(match, "Aucun chiffre trouvé dans le texte de stock").to.not.be
          .null;

        initialStock = parseInt(match[0], 10);
        expect(initialStock).to.be.a("number").and.to.be.at.most(0);
      }
    );

    cy.intercept("PUT", "/orders/add").as("addToCart");

    cy.get('[data-cy="detail-product-add"]').click();

    // Attend que l’appel ait lieu
    cy.wait("@addToCart");

    // Vérifier qu’on n’a pas été redirigé vers le panier
    cy.location("hash").should("not.include", "/cart");

    // Et qu'on est bien resté sur une fiche produit
    cy.get('[data-cy="detail-product-stock"]').should("exist");
  });


  it("ne devrait pas permettre d’ajouter une quantité supérieure au stock", () => {
    cy.contains('[data-cy="product"]', "Aurore boréale")
      .find('[data-cy="product-link"]')
      .click();

    // 💡 Attendre que la fiche produit soit bien chargée
    cy.get('[data-cy="detail-product-price"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // Extraire dynamiquement le stock
    cy.get('[data-cy="detail-product-stock"]', { timeout: 10000 })
      .should(($el) => {
        const stockText = $el.text().trim();
        expect(stockText).to.match(/\d+\s*en stock/); // force l’attente du nombre
      })
      .invoke("text")
      .then((text) => {
        const cleaned = text.trim();
        const match = cleaned.match(/\d+/);
        const availableStock = parseInt(match[0], 10);
        const tooMuch = availableStock + 3; // On ajoute 3 pour être sûr de dépasser le stock

        cy.get('[data-cy="detail-product-quantity"]')
          .clear() //Vide le champ quantité
          .type(tooMuch.toString());

        // Interception AVANT le clic
        cy.intercept("PUT", "/orders/add").as("addToCart");

        cy.get('[data-cy="detail-product-add"]').click();

        // Attend que l’appel ait lieu
        cy.wait("@addToCart");

        // Vérifier qu’on n’a pas été redirigé vers le panier
        cy.location("hash").should("not.include", "/cart");

        // Et qu'on est bien resté sur une fiche produit
        cy.get('[data-cy="detail-product-stock"]').should("exist");
      });
  });

  it("ne devrait pas permettre d’ajouter une quantité négative au panier", () => {
    cy.contains('[data-cy="product"]', "Mousse de rêve")
      .find('[data-cy="product-link"]')
      .click();

    cy.get('[data-cy="detail-product-price"]', { timeout: 10000 }).should(
      "be.visible"
    );

    // On tape directement une valeur négative
    cy.get('[data-cy="detail-product-quantity"]').clear().type("-10");

    cy.get('[data-cy="detail-product-add"]').click();

    //Pas de redirection vers le panier
    cy.location("hash").should("not.include", "/cart");

    // On reste sur la fiche produit
    cy.get('[data-cy="detail-product-stock"]').should("exist");
  });
});

/// <reference types="cypress" />
describe("searchOffer", () => {
  before(() => {
    cy.visit(Cypress.env("host"));
  });

  it("should navigate to the search offer page", () => {
    cy.visit(Cypress.env("host"));
    cy.get('input[name="location"]').type("paris");

    cy.get(".search-btn").click();

    cy.url().should("include", "/search");
    cy.get("h3").contains("Résulat de recherche");
  });

  it("should navigate to the  search offer page", () => {
    cy.visit(Cypress.env("host"));
    cy.get("a#logo").click();
    cy.get('input[name="location"]').type("aaa");

    cy.get(".search-btn").click();

    cy.url().should("include", "/search");
    cy.get("#emptyOfferResult").contains("Aucun Résultat trouvé.");
  });
});

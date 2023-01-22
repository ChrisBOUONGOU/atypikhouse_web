/// <reference types="cypress" />
describe("Navigation", () => {
  
  before(() => {
    cy.visit(Cypress.env("host"));
  });

  it("should navigate to the about-us page", () => {
    cy.get('a[href*="/about-us"]').click();

    cy.url().should("include", "/about-us");+

    cy.get("h1").contains("A propos de nous");
  });

  it("should navigate to offer listing ", () => {
    cy.get('.navbar-nav a[href*="/offers-listing"]').click();

    cy.url().should("include", "/offers-listing");

    cy.get("h1").contains("Liste des offres disponibles");
  }); 
  
 
});

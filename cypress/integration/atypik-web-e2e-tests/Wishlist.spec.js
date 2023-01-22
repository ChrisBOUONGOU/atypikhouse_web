/// <reference types="cypress" />
describe("Test Whishlist", () => {
    
  before(() => {
    cy.visit(Cypress.env("host"));
  });

  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it("Should visit Whishlist page", () => {
    cy.get('a[href*="/profile"]').first().click();
    cy.get('a[href*="/profile/my-favorites"]').first().click();
    cy.get("h1").should("be.visible");
    cy.get('a[href*="/offers-listing"]').first().click();
    cy.wait(1000);
    cy.get(".add-to-favorites").first().click();
    cy.wait(1000);
    cy.get(".remove-from-favorites").should("be.visible");
    cy.get('a[href*="/profile"]').first().click();
    cy.get('a[href*="/profile/my-favorites"]').first().click();
    cy.get(".remove-from-favorites").click({ multiple: true });
    cy.get(".remove-from-favorites").should("not.exist");
  });

});

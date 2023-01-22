/// <reference types="cypress" />
describe("Navigation", () => {
  before(() => {
    cy.visit(Cypress.env("host"));
  });

  it("should navigate to home page and find footer", () => {
    cy.wait(500);
    cy.get(".footer")
      .should("have.css", "background-color")
      .and("eq", "rgb(102, 102, 102)");
  });
});

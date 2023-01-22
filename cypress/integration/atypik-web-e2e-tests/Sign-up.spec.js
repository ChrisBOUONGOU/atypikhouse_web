/// <reference types="cypress" />
describe("Sign-up Scenario", () => {
  before(() => {
    cy.visit(Cypress.env("host"));
  });

  it("should Sign-up", () => {
    const id = cy.atypikUtils.generateId(16);
    cy.get("#sign-up").click();
    cy.get("#register-from input[name='firstName']").type("Jhon");
    cy.get("#register-from input[name='lastName']").type("Doe");
    cy.get("#register-from input[name='email']").type(id + "@test.fr");
    cy.get("#register-from input[name='password']").type(id);
    cy.get("#register-from input[name='confirmPassword']").type(id);
    cy.get("#register-from button[type='submit']").click();
    cy.get("#signUpSuccessMessage").should("be.visible");
    cy.get("#signUpSuccessMessage").contains("Félicitations");
  });
});

/// <reference types="cypress" />
describe("fail Login  Scenario", () => {
  
  before(() => {
    cy.visit(Cypress.env("host"));
  });

  beforeEach(() => {
    cy.loginBy("nonExistentAccount@gmail.com","azerty123");
  });

  it("should not Login", () => {
    cy.get("#credentialError").should("be.visible");
  });
});

describe("succes Login Scenario", () => {
  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it("should Login", () => {
    cy.get("#signout").should("be.visible");
  });
});



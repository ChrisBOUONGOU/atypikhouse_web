/// <reference types="cypress" />
describe("Test Reservation", () => {
  
  before(() => {
    cy.visit(Cypress.env("host"));
  });

  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it("Should Reserve offer", () => {
    // When
    cy.get('a[href*="/offers-listing"]').first().click();

    cy.get(".ah-offer-card a").first().click();
    // should
    cy.url().should("include", "/offers");
    //When
    const getNextMonth = () => {
      cy.get(".react-calendar__navigation__next-button").first().click();
    };

    const monthMustHaveMoreThanTwoActiveDate = (arr) => arr.length >= 2;
    cy.atypikUtils
      .whileNotExistDo(
        ".react-calendar__month-view__days__day:not([disabled])",
        monthMustHaveMoreThanTwoActiveDate,
        getNextMonth,
        20
      )
      .then(() => {
        cy.log("finish");
      })
      .catch(() => {
        //do Nothing
      });

    cy.log("Main test");

    cy.get(".react-calendar__month-view__days__day:not([disabled]")
      .first()
      .click();
    cy.get(".react-calendar__month-view__days__day:not([disabled]")
      .first()
      .click();

    cy.get("#reserve").click();
    //Should
    cy.url().should("include", "/checkout/payment");

    cy.get("body").then((html) => {
      const $count = cy.$$(html).find("#billing-address-form").length;
      if ($count > 0) {
        cy.get("#billing-address-form input[name='firstName']").type("Jhon").should('have.value', 'Jhon');
        cy.get("#billing-address-form input[name='lastName']").type("Doe").should('have.value', 'Doe');
        cy.get("#billing-address-form input[name='email']").type(
          "aaaaaaa@test.fr"
        );
        cy.get("#billing-address-form input[name='phone']").type("0102030405").should('have.value', '0102030405');
        cy.get("#billing-address-form input[name='address']").type(
          "63 Rue Galande"
        ).should('have.value', '63 Rue Galande');
        cy.get("#billing-address-form input[name='city']").type("Paris").should('have.value', 'Paris');
        cy.get("#billing-address-form input[name='codePostal']").type("75000").should('have.value', '75000');
        cy.get("#billing-address-form button[type='submit']").click();
      } else {
        // Do nothing
      }
    });

    cy.get(".ah-check-box label").first().click();

    cy.get("#paypal-button-form button").click();

    cy.url().should("include", "/checkout/confirmation");
  });
});

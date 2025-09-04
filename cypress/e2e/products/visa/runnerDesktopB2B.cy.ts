import {saleType} from "./functions";


beforeEach('Applicable Cases Before Each TestCase', () => {
    cy.viewport(1366, 768)

})


describe('Visa', () => {

    it('Scenario #1: Sale Without Transaction', () => {
        saleType('b2b');
    })


})


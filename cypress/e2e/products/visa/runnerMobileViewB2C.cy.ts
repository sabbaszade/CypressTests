import {saleType} from "./functions";


beforeEach('Applicable Cases Before Each TestCase', () => {
    cy.viewport(375, 667)
})


describe('Visa', () => {

    it('Scenario #1: Sale Without Transaction', () => {
        saleType('mobile');
    })


})


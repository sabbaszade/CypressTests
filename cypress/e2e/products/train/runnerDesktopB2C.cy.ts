import { apiTickets,  apiToken, apiOrder} from "../../general";
import {apiAvailable} from "./utils";
import {saleType} from "./functions";


beforeEach('Applicable Cases Before Each TestCase', () => {
    cy.viewport(1366, 768)
    apiToken('b2c');
    apiAvailable('b2c');
    apiOrder('others' , 'b2c');
    apiTickets('b2c');
})


describe('Train', () => {

    it.only('Scenario #1: Sale And Refund With Charge The Account', () => {
        saleType('b2c',false);
    })

    it('Scenario #2: Sale And Refund With Banking portal', () => {
        saleType('b2c',true);
    })

})
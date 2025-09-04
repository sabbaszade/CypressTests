import { apiTickets,  apiToken, apiOrder} from "../../general";
import {apiAvailable} from "./utils";
import {saleType} from "./functions";


beforeEach('Applicable Cases Before Each TestCase', () => {
    cy.viewport(1366, 768)
    apiToken('b2b');
    apiAvailable('b2b');
    apiOrder('others' , 'b2b');
    apiTickets('b2b');
})


describe('Train', () => {

    it.only('Scenario #1: Sale And Refund With Charge The Account', () => {
        saleType('b2b',false);
    })

    it('Scenario #2: Sale And Refund With Banking portal', () => {
        saleType('b2b',true);
    })

})
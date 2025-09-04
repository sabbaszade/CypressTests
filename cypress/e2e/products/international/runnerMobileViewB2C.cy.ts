
import {apiMyTrips, apiOrderDetails, apiPayment, apiReason, apiTickets,  apiToken, apiOrder} from "../../general";
import {apiAvailable,} from "./utils";
import {saleType} from "./functions";


beforeEach('Applicable Cases Before Each TestCase', () => {
    cy.viewport(375, 667)
    apiToken('b2c');
    apiAvailable('b2c');
    apiOrder('others' , 'b2c');
    apiTickets('b2c');
    apiMyTrips('b2c');
    apiOrderDetails('b2c');
    apiReason('b2c');
    apiPayment('b2c');
})


describe('International Flight', () => {

    it.only('Scenario #1: Sale And Refund With Charge The Account', () => {
        saleType('mobile',false);
    })

    it('Scenario #2: Sale And Refund With Banking portal', () => {
        saleType('mobile',true);
    })


})


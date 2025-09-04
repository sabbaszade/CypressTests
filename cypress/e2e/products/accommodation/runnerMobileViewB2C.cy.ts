
import {apiToken, apiOrder, apiTickets, apiMyTrips, apiOrderDetails, apiPayment, apiReason} from "../../general";
import {apiAvailable} from "./utils";
import {saleType} from "./functions";


beforeEach('Applicable Cases Before Each TestCase', () => {
    cy.viewport(420, 920)
    apiToken('b2c');
    apiAvailable('b2c');
    apiOrder('others' , 'b2c');
    apiTickets('b2c');
    apiMyTrips('b2c');
    apiOrderDetails('b2c');
    apiReason('b2c');
    apiPayment('b2c');

})


describe('Accommodation', () => {

    it.only('Scenario #1: Sale And Refund With Charge The Account', () => {
        saleType('mobile',false);
    })

    it('Scenario #2: Sale And Refund With Banking portal', () => {
        saleType('mobile',true);
    })

})

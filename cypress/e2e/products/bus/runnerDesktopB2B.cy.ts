
import {apiMyTrips, apiOrderDetails, apiPayment, apiReason, apiTickets,  apiToken, apiOrder} from "../../general";
import {apiAvailable, apiSeat } from "./utils";
import {saleType} from "./functions";



beforeEach('Applicable Cases Before Each TestCase', () => {
    cy.viewport(1366, 768)
    apiToken('b2b');
    apiAvailable('b2b');
    apiSeat('b2b');
    apiOrder('others','b2b');
    apiTickets('b2b');
    apiMyTrips('b2b');
    apiOrderDetails('b2b');
    apiReason('b2b');
    apiPayment('b2b');
})


describe('Bus', () => {

    it.only('Scenario #1: Sale And Refund With Charge The Account', () => {
        saleType('b2b',false);

    })

    it('Scenario #2: Sale And Refund With Banking portal', () => {
        saleType('b2b',true);
    })
})


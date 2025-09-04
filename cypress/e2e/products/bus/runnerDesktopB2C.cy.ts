
import {apiMyTrips, apiOrderDetails, apiPayment, apiReason, apiTickets,  apiToken, apiOrder} from "../../general";
import {apiAvailable, apiSeat } from "./utils";
import {saleType} from "./functions";



beforeEach('Applicable Cases Before Each TestCase', () => {
    cy.viewport(1366, 768)
    apiToken('b2c');
    apiAvailable('b2c');
    apiSeat('b2c');
    apiOrder('others' , 'b2c');
    apiTickets('b2c');
    apiMyTrips('b2c');
    apiOrderDetails('b2c');
    apiReason('b2c');
    apiPayment('b2c');
})


describe('Bus', () => {

    it.only('Scenario #1: Sale And Refund With Charge The Account', () => {
        saleType('b2c',false);

    })

    it('Scenario #2: Sale And Refund With Banking portal', () => {
        saleType('b2c',true);
    })
})
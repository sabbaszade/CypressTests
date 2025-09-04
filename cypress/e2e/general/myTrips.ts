import {clickButton, clickButtonPriority} from "./index";

export function continueRefund(index , checkReason){
    clickButtonPriority('inquiry' , 0);
    if(checkReason === true){
        clickButtonPriority('refund-personal-reason' , index);
        clickButtonPriority('submit' , 0);
    }
}
export function paymentRefund(product){
    if(product === 'hotel'){
        cy.wait(1000)
        cy.get('[data-test="payment-methode"] span.is-radio').first().click();
        cy.wait(1000)
        cy.get('[data-test="submit"]').click();
    }
    else{
        cy.get('[data-test="submit"]').click();
        // cy.wait('@paymentTypes' , { timeout: 30000 });
        cy.wait(3000)
        cy.get('[data-test="payment-methode"] span.is-radio').first().click();
        clickButtonPriority('submit' , 0);
        cy.wait(2000);
    }
}
export function clickOrder(platform){
    cy.readFile(`cypress/fixtures/dataOrder.json`).then((data) => {
        cy.get(`#order-${data.data}`).within(() => {
            if (platform !== 'mobile') {
                clickButton('order-details');
            } else { 
                cy.get(`.a-card__footer > .btn > .text-callout`).click();
            }
        })
    });
    
}

export function apiMyTrips(platform) {
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'GET',
        url: '/api/v1/mytrips/orders*',
        hostname: host
    }).as('myTrips')
}

export function apiOrderDetails(platform) {
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'GET',
        url: '/api/v1/mytrips/orders/details/*',
        hostname: host
    }).as('orderDetails')
}

export function apiReason(platform) {
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'GET',
        url: '/api/v1/profile/refunds/reason/*',
        hostname: host
    }).as('refundReason')
}

export function apiPayment(platform) {
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'GET',
        url: '/api/v1/refund/payment-types/available-payment-type/*',
        hostname: host
    }).as('paymentTypes')
}
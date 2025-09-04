import {commonTestData} from "../../../data/dataTestCommon";
import {clickButton, clickButtonPriority, clickOrder} from "./index";



export function checkOrder(status_text , isMyTrips , ticket , platform ){
    console.log('check order status in after bank')
    checkTicket(status_text , ticket);
    console.log('download ticket')
    downloadTicket(platform);
    if(isMyTrips){
        console.log('go to myTrips')
        //////////////////////////////////////////////////////////////b2b
        if(platform === 'b2b'){
            cy.contains(' سفارش‌ها و استرداد ').click()
        } else if (platform == 'mobile') {
            clickButtonPriority('orders', 0)
        }
        else {
            clickButtonPriority('my-trips' ,0)
        }
        // cy.wait('@myTrips', {timeout: 30000})
        console.log('click on order in myTrips')
        if(ticket === false){
            cy.get('[data-test="order-id"]').eq(0).then(($child) => {
                cy.writeFile('./cypress/fixtures/dataOrder.json', {data:$child.text()})
            })
        }
        clickOrder(platform);
        // cy.wait('@orderDetails' , { timeout: 30000 })
    }
}
export function checkTicket(text , ticket) {
    cy.get('.result__inner > .text-success-400').should('contain.text', text);
    cy.get('.result__inner > .font-bold').invoke('text')
        .then((text) => {
            commonTestData.dataAfterBank.ticketNumber = text;
        });
    if(ticket === true){
        cy.get('.result__inner > .font-bold').should('contain.text', 'شماره سفارش');
        cy.get('.result__inner > .font-bold').then(($child) => {
            const orderNum = $child.text()
            const match = orderNum.match(/\d+/);
            const integerPart = match ? match[0] : null;
            cy.writeFile('./cypress/fixtures/dataOrder.json', {data:integerPart})
        })
    }

}


export function downloadTicket(platform) {
    if(platform === 'b2c'){
        cy.get('.flex-col > .btn').then($link => {
            const linkUrl = $link.attr('href')
            cy.get('a.btn[download="download.pdf"]').click({force:true});
            // cy.wrap($link).trigger('contextmenu', {button: 2})
            cy.window().then(win => {
                win.open(linkUrl, '_blank')
            });
        });
    }
    if(platform === 'b2b'){

    }

}

export function apiTickets(platform) {
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'GET',
        url: '/api/v1/coordinator/order/*/tickets',
        hostname: host
    }).as('afterBank')
}


/////////////////////////////////////////////////////////////////////////////////////////////
export function clickOrderDomestic(status_text , isMyTrips , ticket , platform ){
    console.log('check order status in after bank')
    checkTicketDom(status_text , ticket);
    console.log('download ticket')
    downloadTicketDom(platform);
    if(isMyTrips){
        console.log('go to myTrips')
       clickButton('submit');
        console.log('click on order in myTrips')
        if(ticket === false){
            cy.get('[data-test="order-id"]').eq(0).then(($child) => {
                cy.writeFile('./cypress/fixtures/dataOrder.json', {data:$child.text()})
            })
        }
    }
}



export function checkTicketDom(text , ticket) {
    cy.get('.a-alert__title').invoke('text')
        .then((text) => {
            commonTestData.dataAfterBank.ticketNumber = text;
        });
    if(ticket === true){
        cy.get('.text-callout').then(($child) => {
            const orderNum = $child.text()
            cy.writeFile('./cypress/fixtures/dataOrder.json', {data:orderNum})
        })
    }

}


export function downloadTicketDom(platform) {
    if(platform === 'b2b'){
        cy.get('.is-solid-secondary').click();
        cy.get('a.btn').eq(1).click({force:true});

    }
}
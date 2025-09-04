import {checkDataFromFile, clickButton, iranKish, mellat, novin, sadad, sep, tap} from "./index";

export function finalizeTransaction(isTransaction, vertical) {
    console.log('check last price and final transaction')
    // checkDataFromFile('last-price' , 'price' , '' , 0);
    cy.scrollTo('bottom')
    confirmPayment(isTransaction, vertical);
    cy.wait('@afterBank', {timeout: 50000})
}

export function confirmPayment(portal, vertical) {
    if (portal === false) {
        cy.wait(5000)
        // cy.get('.a-checkbox__custom-input').eq(0).click({force:true})
        cy.get('[data-test="use-credit"] span').eq(0).click({force: true})
        // if(vertical === 'accommodation-tab'){
        //     cy.wait(2000)
        //     cy.get('[data-test="use-credit"] span').eq(0).click()
        // }
        cy.wait(2000)
    }
    clickButton('submit');
    if (portal === true) {
        cy.intercept('GET', 'https://sep.shaparak.ir/**').as('allRequests');
        cy.intercept('GET', 'https://sadad.shaparak.ir/**').as('allRequests');
        cy.intercept('GET', 'https://ikc.shaparak.ir/**').as('allRequests');
        cy.intercept('GET', 'https://pec.shaparak.ir/**').as('allRequests');
        cy.intercept('GET', 'https://bpm.shaparak.ir/**').as('allRequests');
        cy.intercept('GET', 'https://pna.shaparak.ir/**').as('allRequests');
        cy.wait('@allRequests' , {timeout:20000}).then((interception) => {
            if (interception.response) {
                const newURL = interception.response.url;
                cy.log('Banking Portal URL:', newURL);
                if (newURL.includes('https://sep.shaparak.ir')) {
                    sep();
                } else if (newURL.includes('https://sadad.shaparak.ir/Purchase')) {
                    sadad();
                } else if (newURL.includes('https://ikc.shaparak.ir')) {
                    iranKish();
                } else if (newURL.includes('https://pec.shaparak.ir')) {
                    cy.log('tapppppp:', newURL);
                    tap(newURL);
                } else if (newURL.includes('https://bpm.shaparak.ir')) {
                    mellat();
                } else if (newURL.includes('https://pna.shaparak.ir')) {
                    novin();
                }
            }


        })




    }

}




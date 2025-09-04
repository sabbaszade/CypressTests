import {commonTestData} from "../../../../data/dataTestCommon";
import {busTestData} from "../../../../data/dataTestBus";
import {checkDataFromFile, checkDataStatic, fillField , plpSaveDataCard , paxFillDate} from "../../general";
import { platform } from "os";



export function apiAvailable(platform){
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'GET',
        url: '/api/v2/bus/available*',
        hostname: host
    }).as('getAvailable')
}

export function apiSeat(platform){
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'GET',
        url: '/api/v1/bus/available/*/seats',
        hostname: host
    }).as('getSeats')
}
export function selectChair(){
    let emptyChairFound = false;
    cy.get('.chair-cell-bus .chair')
        .each(($chair) => {
            if (!$chair.hasClass('is-full')) {
                if (!$chair.hasClass('chair-stripes')) {
                    cy.wrap($chair).click();
                    cy.log('seatNumber', $chair.text())
                    localStorage.setItem('seatNumber', $chair.text())
                    busTestData.dataSeat.seatNumber = localStorage.getItem('seatNumber')
                    emptyChairFound = true
                    return false;
                }
            }
        });
}
export function selectAvailable(platform) {
    const iterateAvailableCards = () => {
        cy.get('.available-card').then(($availableCards) => {
            let i = 0
            const processNextCard = () => {
                if (i >= $availableCards.length || commonTestData.dataOthers.stopIteration) {
                    return;
                }
                const $available = $availableCards.eq(i);
                cy.wrap($available).within(() => {
                    cy.get('[data-test="item-provider"]').then(($child) => {
                        const provider = $child.text()
                        cy.writeFile('cypress/fixtures/provider.json', { provider: provider });
                        if (provider === busTestData.dataProvider.supplier) {
                            if ($available.hasClass('is-disabled')) {
                                commonTestData.dataOthers.flag = true;
                            } else {
                                plpSaveDataCard($available , 'item-provider' , '');
                                plpSaveDataCard($available , 'item-type' , '');
                                plpSaveDataCard($available , 'item-price' , 'strong.text-secondary-400');
                                plpSaveDataCard($available, 'item-time', '');
                                
                                cy.wrap($available).within(() => {
                                    if (platform === 'mobile') {
                                        cy.get('[data-test="item-provider"]').click();
                                    } else {
                                        cy.get('[data-test="item-button"]').then(($child) => {
                                            cy.wrap($child).click({ force: true });
                                        })
                                    }
                                })
                                commonTestData.dataOthers.stopIteration = true;
                                cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                            }
                        }
                        if ((provider !== busTestData.dataProvider.supplier) && (i+1 >= $availableCards.length)) {
                            commonTestData.dataOthers.flag = true;
                        }
                    });
                }).then(() => {
                    if (commonTestData.dataOthers.flag) {
                        cy.get('[data-test="next-button"]').click({force: true})
                        cy.wait(5000).then(() => {
                            commonTestData.dataOthers.flag = false
                            iterateAvailableCards()
                        })

                    } else if (!commonTestData.dataOthers.stopIteration) {
                        i++;
                        cy.wait(0).then(processNextCard);
                    }
                });
            };
            processNextCard();
        });
    };
    iterateAvailableCards();
}

export function checkAvailableInfoPax(platform) {
    console.log('check available info in pax')
    if (platform !== 'mobile') {
        checkDataFromFile('price-details', 'price', 'strong', 0,);
        checkDataFromFile('total-price', 'price', 'strong', 0);
        checkDataFromFile('departure-time', 'time', '', 0);
        checkDataFromFile('provider', 'provider', '', 0);
        checkDataFromFile('type', 'type', '', 0);
    } 
    checkDataStatic('origin' , busTestData.dataHomePage.origin  , '' ,0);
    checkDataStatic('destination' , busTestData.dataHomePage.destination  ,'' ,0);
    cy.wait('@getSeats', {timeout: 30000})
}

export function fillPassengerInfo(platform){
    console.log(' fill passenger info in pax')
    selectChair();
    cy.scrollTo(0, 1000)
    fillField('name' , commonTestData.dataPax.name);
    fillField('lastName' , commonTestData.dataPax.name);
    fillField('nationalCode' , commonTestData.dataPax.nationalId);
    fillField('phoneNumber' , commonTestData.dataPax.mobileNumber);
    paxFillDate(0 , 0, platform);
}

export function checkAvailableInfoConfirm(){
    console.log('check info available in confirm')
    cy.wait('@getOrder', {timeout: 30000})
    checkDataStatic('originName-cell' , busTestData.dataHomePage.origin , '' , 0);
    checkDataStatic('destinationName-cell' , busTestData.dataHomePage.destination , '' , 0);
    checkDataFromFile('serviceName-cell' , 'provider' , '' , 0);
    checkDataFromFile('busType-cell' , 'type' , '' , 0);
    checkDataStatic('seatNumber-cell' , busTestData.dataSeat.seatNumber , '' , 0);
    checkDataFromFile('unitPrice-cell' , 'price' , '' , 0);
    checkDataFromFile('totalPrice-cell' , 'price' , '', 0);
    checkDataFromFile('departureDateTime-cell' , 'time' , '', 0);
}

export function checkPassengerInfo(){
    checkDataStatic('name-cell',commonTestData.dataPax.name + ' ' + commonTestData.dataPax.name , '' , 0);
    checkDataStatic('gender-cell',commonTestData.dataPax.gender , '' , 0);
    // checkDataStatic('phoneNumber-cell' , Cypress.env('username') , '' , 0);
}

export function checkAvailableMyTrips(){
    console.log('check info order in myTrips')
    cy.wait(2000);
    checkDataFromFile('price' , 'price' , '' , 0);
    checkDataFromFile('order-time' , 'time' , '' , 0);
    cy.get(`[data-test="order-status"]`).should('have.text', 'نهایی شده')
    cy.contains('[data-test="tab-links-item"]' , 'مسافران').should('exist').click();
    checkDataStatic('ful-name' , commonTestData.dataPax.name + ' ' + commonTestData.dataPax.name , '' , 0);
    checkDataStatic('national-code' , commonTestData.dataPax.nationalId , '' , 0);

}

export function otherInfoMyTrips(){
    console.log('check paid price with refund price and order info in myTrips')
    checkDataStatic('origin' , busTestData.dataHomePage.origin , '' , 0);
    checkDataStatic('destination' , busTestData.dataHomePage.destination, '' , 0);
    checkDataFromFile('provider' , 'provider' , '' , 0);
    checkDataFromFile('departure-time-order' , 'time' , '' , 0);
    checkDataFromFile('price-total' , 'price' , '' , 0);
    checkDataFromFile('price-refund' , 'price' , '' , 0);
}
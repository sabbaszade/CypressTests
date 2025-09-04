import {commonTestData} from "../../../../data/dataTestCommon";
import { internationalTestData} from "../../../../data/dataTestInternational";
import {plpSaveDataCard, paxFillDate, paxFillSelectList, checkDataFromFile, checkDataStatic, fillField,paxFillSelectListMobile} from "../../general";



export function apiAvailable(platform) {
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'GET',
        url: '/api/v1/flights/international/proposal-requests/*/best-flights',
        hostname: host
    }).as('getAvailable')
}


export function selectAvailable(platform) {
    // cy.wait(5000);
    const iterateAvailableCards = () => {
        cy.wait(30000)
        cy.get('.available-card').then(($availableCards) => {
                let i = 0
                const processNextCard = () => {
                    if (i >= $availableCards.length || commonTestData.dataOthers.stopIteration) {
                        return;
                    }
                    const $available = $availableCards.eq(i);
                    cy.wrap($available).within(() => {
                        cy.get('[data-test="item-airline"]').then(($child) => {
                            const airline = $child.text()
                            cy.writeFile('cypress/fixtures/provider.json', { airline: airline });
                            cy.wait(1000);
                             if ((airline.includes(internationalTestData.dataProvider.airline)) ) {
                                    if ($available.hasClass('is-disabled')) {
                                        commonTestData.dataOthers.flag = true;
                                    } else {
                                        plpSaveDataCard($available, 'item-airline' , '');
                                        plpSaveDataCard($available, 'item-time' , '');
                                        plpSaveDataCard($available , 'item-price' , 'strong.text-secondary-400');
                                        if(platform === 'mobile'){
                                        cy.get('[data-test="item-airline"]').click({force:true}).wait(3000);
                                        }else{
                                            cy.wrap($available).within(() => {
                                                    cy.get('[data-test="item-button"]').then(($child) => {
                                                        cy.wrap($child).click({force:true});
                                                    })
                                                
                                            })
                                        }
                                        cy.log(commonTestData.dataPlp.provider, commonTestData.dataPlp.price, commonTestData.dataPlp.type, commonTestData.dataPlp.time, commonTestData.dataPlp.compartment)
                                        commonTestData.dataOthers.stopIteration = true;
                                        cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                                    }
                                }
                                if ((airline !== internationalTestData.dataProvider.supplier) && (i + 1 >= $availableCards.length)) {
                                    commonTestData.dataOthers.flag = true;
                                }
                            });

                    }).then(() => {
                        if (commonTestData.dataOthers.flag) {
                            cy.get('.swiper-slide-next').find('button').click({force: true})
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
            }
        )
        ;
    };
    iterateAvailableCards();
}


export function checkAvailableInfoPax(platform){
    console.log('check available info in pax')

    if(platform==="mobile"){
    checkDataFromFile('total-price', 'price' , 'strong',0);
    checkDataFromFile('item-date-time' , 'time' , 'b',0);
    }else{
        checkDataFromFile('total-price', 'price' , 'strong',0);
        checkDataFromFile('item-time', 'time' , '',0);
        checkDataFromFile('item-airline', 'airline' , '',0);
        checkDataFromFile('price-details', 'price' , 'strong',0);
    }
}

export function fillPassengerInfo(platform){
    console.log(' fill passenger info in pax')
    cy.scrollTo(0, 1000);
    fillField('nationalCode', commonTestData.dataPax.nationalId);
    fillField('name', commonTestData.dataPax.nameLatin);
    fillField('lastName', commonTestData.dataPax.nameLatin);
    fillField('passportNumber', commonTestData.dataPax.passportNumber);
    if(platform === 'mobile'){
        paxFillSelectListMobile('gender','male');
        paxFillSelectListMobile('passport-country' , 'IRN');
    }else{
        paxFillSelectList('gender','male');
        paxFillSelectList('passport-country' , 'IRN');
    }
    cy.wait(1000)
    paxFillDate(0 , 1,platform);
    cy.wait(1000)
    paxFillDate(1 , 2,platform);
}

export function checkAvailableInfoConfirm(){
    console.log('check info available in confirm')
    cy.wait('@getOrder', {timeout: 30000})
    checkDataFromFile('airline-cell', 'airline' , '' ,0);
    checkDataFromFile('departureDateTime-cell', 'time' , '',0);
}

export function checkPassengerInfo(platform){
    console.log('check info passenger in confirm')
    checkDataStatic('fullName-cell', commonTestData.dataPax.nameLatin + " " + commonTestData.dataPax.nameLatin,'',0);
    checkDataStatic('gender-cell', commonTestData.dataPax.gender,'',0);
    checkDataStatic('code-cell', commonTestData.dataPax.passportNumber,'',0);
    checkDataStatic('birthdate-cell', commonTestData.dataPax.birthDate,'',0);
    checkDataStatic('placeOfIssue-cell', commonTestData.dataPax.placeOfBirth,'',0);
    if(platform ==="mobile"){
        checkDataFromFile('total-price', 'price','strong',0);
    }else{
    checkDataFromFile('last-price', 'price','',0);
    }
    // checkDataStatic('contact-phone', Cypress.env('username'),'',0);
    // checkDataStatic('contact-email', Cypress.env('email'),'',0);
}

export function checkAvailableMyTrips(){
    console.log('check info order in myTrips')
    checkDataFromFile('price' , 'price' , '',0);
    cy.get(`[data-test="order-status"]`).should('have.text', 'نهایی شده')
}

export function otherInfoMyTrips(){
    console.log('check passenger name in myTrips')
    checkDataStatic('full-name' , commonTestData.dataPax.nameLatin + ' ' + commonTestData.dataPax.nameLatin ,'', 0 );
    console.log('check paid price with refund price in myTrips')
    checkDataFromFile('price-total' , 'price' , '', 0);
    checkDataFromFile('price-refund' , 'price' , '',0);
}
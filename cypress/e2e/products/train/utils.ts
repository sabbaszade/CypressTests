import {commonTestData} from "../../../../data/dataTestCommon";
import {trainTestData} from "../../../../data/dataTestTrain";
import {
    paxFillDate,
    paxFillSelectList,
    plpSaveDataCard,
    checkDataFromFile,
    checkDataStatic,
    fillField,
    clickButton, paxFillSelectListMobile
} from "../../general";
import {busTestData} from "../../../../data/dataTestBus";
import {platform} from "os";

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
        url: '/api/v2/train/available/*',
        hostname: host
    }).as('getAvailable')
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
                    if(platform === 'mobile'){
                        var priority = 1; // eshtebahi datatest set shode
                    }
                    else{
                        var priority = 1;
                    }
                    cy.get(`[data-test="item-compartment"]`).eq(priority).then(($child) => {
                        const compartment = $child.text();
                        cy.log('com:',compartment)
                        cy.writeFile('cypress/fixtures/provider.json', { compartment: compartment });
                        if (compartment === trainTestData.dataProvider.compartment) {
                            if ($available.hasClass('is-disabled')) {
                                commonTestData.dataOthers.flag = true;
                            } else {
                                if(platform === 'mobile'){
                                    plpSaveDataCard($available , 'price' , '');
                                }else{
                                    plpSaveDataCard($available , 'item-price' , 'strong.text-secondary-400');
                                }
                                plpSaveDataCard($available, 'item-provider' , '');
                                plpSaveDataCard($available, 'item-time' , '');
                                plpSaveDataCard($available, 'item-compartment' , '');
                                cy.wrap($available).within(() => {
                                    if(platform === 'mobile'){
                                        cy.get('[data-test = item-provider]').click({force:true})
                                    }else{
                                        cy.get('button').then(($child) => {
                                            cy.wrap($child).click();
                                        })
                                    }

                                })
                                commonTestData.dataOthers.stopIteration = true;
                                cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                            }
                        }
                        if ((compartment !== trainTestData.dataProvider.compartment) && (i+1 >= $availableCards.length)) {
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
    if(platform === 'mobile'){
        clickButton('toggle-price')
        checkDataFromFile('item-provider' , 'provider' , '', 0);
    }else{
        checkDataFromFile('provider' , 'provider' , '', 0);
        // checkDataFromFile('type', 'type' , '',0);
        checkDataFromFile('compartment', 'compartment' , '',0);
        checkDataStatic('origin', trainTestData.dataHomePage.origin , '',0);
        checkDataStatic('destination', trainTestData.dataHomePage.destination , '',0);
    }
    console.log('check available info in pax')
    checkDataFromFile('price-details', 'price' , 'strong' , 0);
    checkDataFromFile('total-price', 'price' , 'strong',0);
    checkDataFromFile('item-time', 'time' , '',0);
}

export function fillPassengerInfo(platform){
    console.log(' fill passenger info in pax')
    cy.scrollTo(0, 1000)
    if(platform === 'mobile'){
        paxFillSelectListMobile('gender' , 'male');
        paxFillSelectListMobile('departing-service-type' , 'بدون غذا');

    }else{
        paxFillSelectList('gender','male');
        cy.get(`[data-test="departing-service-type"] > .a-input > .a-input__input > .self-stretch`).click()
        cy.get('#app > div.wrapper > main > form > div.a-card.a-card-section > div > div.py-4 > div.md\\:-ml-4 > div > div.is-small-menu.passenger-field-col.my-4.lg\\:my-5.md\\:pl-4.relative > div > div.v-dropdown.pretty-scroll.is-open > div > ul > li:nth-child(1) > a > span').click({force:true})
    }
    fillField('nationalCode', commonTestData.dataPax.nationalId);
    fillField('namePersian', commonTestData.dataPax.name);
    fillField('lastNamePersian', commonTestData.dataPax.name);
     paxFillDate(0 , 0, platform);
}

export function checkAvailableInfoConfirm(){
    console.log('check info available in confirm')
    cy.wait('@getOrder', {timeout: 30000})
    checkDataFromFile('serviceName-cell', 'provider','',0);
    checkDataStatic('originName-cell', trainTestData.dataHomePage.origin,'',0);
    checkDataStatic('destinationName-cell', trainTestData.dataHomePage.destination,'',0);
    // checkDataFromFile('trainNumber-cell', 'type','',0);
    checkDataFromFile('departureDateTime-cell', 'time','',0);
}

export function checkPassengerInfo(platform){
    console.log('check info passenger in confirm')
    if(platform !== 'mobile'){
        checkDataFromFile('price-cell', 'price','',0);
    }
    checkDataStatic('name-persian-cell', commonTestData.dataPax.name + ' ' + commonTestData.dataPax.name,'',0);
    checkDataStatic('gender-cell', commonTestData.dataPax.gender,'',0);
    checkDataStatic('code-cell', commonTestData.dataPax.nationalId,'',0);
    checkDataStatic('birthdate-cell', commonTestData.dataPax.birthDate,'',0);
    checkDataStatic('contact-phone', Cypress.env('username'),'',0);
    checkDataStatic('contact-email', Cypress.env('email'),'',0);
}

export function checkAvailableMyTrips(){
    console.log('check info order in myTrips')
    cy.wait(2000);
    checkDataFromFile('price' , 'price' , '' , 0);
    // checkDataFromFile('order-time' , 'time' , '' , 0);
    cy.get(`[data-test="order-status"]`).should('have.text', 'نهایی شده')
    cy.contains('[data-test="tab-links-item"]' , 'مسافران').should('exist').click();
    // checkDataStatic('ful-name' , commonTestData.dataPax.name + ' ' + commonTestData.dataPax.name , '' , 0);
    // checkDataStatic('national-code' , commonTestData.dataPax.nationalId , '' , 0);
}
export function otherInfoMyTrips(){
    console.log('check paid price with refund price and order info in myTrips')
    // checkDataStatic('origin' , trainTestData.dataHomePage.origin , '' , 0);
    // checkDataStatic('destination' , trainTestData.dataHomePage.destination, '' , 0);
    // checkDataFromFile('provider' , 'provider' , '' , 0);
    // checkDataFromFile('departure-time-order' , 'time' , '' , 0);
    checkDataFromFile('price-total' , 'price' , 'strong' , 0);
    checkDataFromFile('price-refund' , 'price' , 'strong' , 0);
}
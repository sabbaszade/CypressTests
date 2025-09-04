import {commonTestData} from "../../../../data/dataTestCommon";
import {domesticTestData} from "../../../../data/dataTestDomestic";
import {
    paxFillDate,
    paxFillSelectList,
    plpSaveDataCard,
    checkDataFromFile,
    checkDataStatic,
    fillField,
    paxFillSelectListMobile
} from "../../general";
export function apiAvailable(platform) {
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'POST',
        url: '/api/v1/flights/domestic/available',
        hostname: host
    }).as('getAvailable')
}

export function apiCrossSell(platform) {
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'POST',
        url: '/api/v1/flights/domestic/cross-sell/get-info-by-variant',
        hostname: host
    }).as('getCrossSell')
}
export function selectAvailable(platform) {
    console.log('select available');
    const iterateAvailableCards = () => {
        cy.get('.available-card').then(($availableCards) => {
                let i = 0
                const processNextCard = () => {
                    if (i >= $availableCards.length || commonTestData.dataOthers.stopIteration) {
                        return;
                    }

                    const $available = $availableCards.eq(i);
                    cy.wait(1000);
                    cy.wrap($available).within(() => {
                        cy.get('[data-test="item-provider"]').then(($child) => {
                            const provider = $child.text()
                            cy.writeFile('cypress/fixtures/provider.json', { provider: provider });
                            if (provider === domesticTestData.dataProvider.provider) {
                                if ($available.hasClass('is-disabled')) {
                                    commonTestData.dataOthers.flag = true;
                                } else {
                                    cy.wait(2000)
                                    plpSaveDataCard($available, 'item-provider' , '');
                                    cy.wait(2000)
                                    if(platform === 'mobile'){
                                        plpSaveDataCard($available , 'price' , '');
                                    }else{
                                        plpSaveDataCard($available , 'item-price' , 'strong.text-secondary-400');
                                    }
                                    cy.wait(2000)
                                    plpSaveDataCard($available, 'item-time' , '');

                                    cy.wrap($available).within(() => {
                                        if(platform === 'mobile'){
                                            cy.get('[data-test="item-provider"]').click();
                                        }else{
                                            cy.get('[data-test="item-button"]').then(($child) => {
                                                cy.wrap($child).click({force:true});
                                            })
                                        }
                                    })
                                    commonTestData.dataOthers.stopIteration = true;
                                    cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                                }
                            }
                            if ((provider !== domesticTestData.dataProvider.provider) && (i+1 >= $availableCards.length)) {
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
        cy.get('[data-test="submit"]').click();
    }
    console.log('check available info in pax')
    if(platform !== 'mobile'){
        checkDataFromFile('price-details' , 'price' , 'strong' , 0);
        checkDataFromFile('total-price' , 'price' , 'strong', 0);
        checkDataFromFile('departure-time' , 'time' , '', 0);
    }
    checkDataFromFile('item-provider' , 'provider' , '', 0);
}

export function fillPassengerInfo(platform){
    console.log(' fill passenger info in pax')
    cy.scrollTo(0, 1000);
    fillField('name' , commonTestData.dataPax.nameLatin);
    fillField('lastName' , commonTestData.dataPax.nameLatin);
    fillField('nationalCode' , commonTestData.dataPax.nationalId);
    // fillField('namePersian' , commonTestData.dataPax.name);
    // fillField('lastNamePersian' , commonTestData.dataPax.name);
    if(platform === 'mobile'){
        paxFillSelectListMobile('gender','male');
    }else{
        paxFillSelectList('gender','male');
    }
    paxFillDate(0 , 0 , platform);


}


export function checkAvailableInfoConfirm(){
    cy.wait('@getCrossSell', {timeout: 60000})
    cy.wait(4000);
    cy.get(`[data-test="submit"]`).first().click()
    console.log('check info available in confirm')
    cy.wait('@getOrder', {timeout: 60000})
    checkDataStatic('originName-cell' , domesticTestData.dataHomePage.origin , '' , 0);
    checkDataStatic('destinationName-cell' , domesticTestData.dataHomePage.destination , '' , 0);
    checkDataFromFile('airline-cell' , 'provider' , '',0);
    checkDataFromFile('departureDateTime-cell' , 'time' , '',0);
}

export function checkPassengerInfo(platform){
    console.log('check info passenger in confirm')
    // checkDataStatic('name-persian-cell',commonTestData.dataPax.name + " " + commonTestData.dataPax.name , '',0);
    checkDataStatic('name-latin-cell',commonTestData.dataPax.nameLatin + " " + commonTestData.dataPax.nameLatin ,'' ,0);
    checkDataStatic('gender-cell',commonTestData.dataPax.gender,'',0);
    checkDataStatic('code-cell' , commonTestData.dataPax.nationalId,'' ,0);
    checkDataStatic('birthdate-cell' , commonTestData.dataPax.birthDate,'',0);
    checkDataStatic('placeOfBirth-cell' , commonTestData.dataPax.placeOfBirth,'',0);
    checkDataStatic('contact-phone' , Cypress.env('username'),'',0);
    checkDataStatic('contact-email' , Cypress.env('email'),'',0);
    if(platform === 'mobile'){
        checkDataFromFile('total-price' , 'price' , 'strong.text-secondary-400',0);
    }else{
        checkDataFromFile('last-price' , 'price' , '',0);
    }
}

export function checkAvailableMyTrips(){
    console.log('check info order in myTrips')
    checkDataFromFile('departure-time' , 'time' , '',0);
    checkDataFromFile('airline' , 'provider' ,'', 0);
    cy.get(`[data-test="order-status"]`).should('have.text', 'نهایی شده')
}
import {checkDataFromFile, checkDataStatic, clearAndFillField, paxFillSelectList, plpSaveDataCard} from "../../general";
import {commonTestData} from "../../../../data/dataTestCommon";
import {hotelTestData} from "../../../../data/dataTestHotel";

let room;
let sup;
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
        url: '/api/v1/hotel/result*',
        hostname: host
    }).as('getAvailable')
}

export function selectAvailable(platform) {
    cy.wait(15000);
    const iterateAvailableCards = () => {
        cy.get('.ho-available-card').then(($availableCards) => {
            let i = 0
            const processNextCard = () => {
                if (i >= $availableCards.length || commonTestData.dataOthers.stopIteration) {
                    return;
                }
                const $available = $availableCards.eq(i);
                cy.wrap($available).within(() => {
                        cy.get('[data-test="hotel-name"]').then(($child) => {
                            const hotelName = $child.text();
                            cy.log('hotel:', hotelName)
                            cy.writeFile('cypress/fixtures/provider.json', { hotelName: hotelName });
                            // if(platform === 'b2b'){
                            //     sup = hotelTestData.dataProvider.supplierB2b;
                            // }
                            // if(platform === 'b2c'){
                                sup = hotelTestData.dataProvider.supplier;
                            // }
                            if (hotelName === sup) {
                                plpSaveDataCard($available, 'price' , '');
                                cy.wrap($available).within(() => {
                                    cy.wait(2000)
                                    if(platform === 'b2b'){
                                        cy.visit(`${Cypress.env('baseUrlB2b')}hotel/ir-yazd/yazd-dad?destination=City_7101534970300072031_%DB%8C%D8%B2%D8%AF&departing=2024-08-19&returning=2024-08-20&rooms=30&countryCode=IR&region=dom&sessionId=65ec9905db5055a08f0892ed&eec-list=1&index=0&cityId=7101534970300072031&initialSessionId=65ec9905db5055a08f0892ed`);
                                    }
                                    if(platform === 'b2c'){
                                        cy.visit(`${Cypress.env('baseUrl')}hotel/ir-yazd/yazd-dad?destination=City_7101534970300072031_%DB%8C%D8%B2%D8%AF&departing=2024-08-19&returning=2024-08-20&rooms=30&countryCode=IR&region=dom&sessionId=65ec9905db5055a08f0892ed&eec-list=1&index=0&cityId=7101534970300072031&initialSessionId=65ec9905db5055a08f0892ed`);
                                    }
                                    if (platform === 'mobile') {
                                        $available.click()   
                                    }
                                    // newTabAvailableHotel();
                                    cy.wait(5000);
                                })
                                commonTestData.dataOthers.stopIteration = true;
                                cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                            }
                            if ((hotelName !== sup) && (i + 1 >= $availableCards.length)) {
                                commonTestData.dataOthers.flag = true;
                            }
                        });
                    }
                ).then(() => {
                    if (commonTestData.dataOthers.flag) {
                        // cy.get('[data-test="next-button"]').click({force: true})
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

export function selectRoom(platform){
    console.log('select type room');

    const iterateAvailableCards = () => {
        cy.get('.a-card.mb-4').then(($availableCards) => {
            let i = 0;
            commonTestData.dataOthers.stopIteration = false;

            const processNextCard = () => {
                if (i >= $availableCards.length || commonTestData.dataOthers.stopIteration) {
                    return;
                }
                const $available = $availableCards.eq(i);
                cy.wrap($available).within(() => {
                        const selector = platform === 'mobile' ? 'h5' : '[data-test="room-name"]'
                        cy.get(selector).then(($child) => {
                            const roomName = $child.text();
                            cy.log('room:', roomName)
                            if(platform === 'b2c' || platform === 'mobile'){
                                room = hotelTestData.dataProvider.roomName;
                            }
                            if(platform === 'b2b'){
                                room = hotelTestData.dataProvider.roomNameB2b;
                            }
                            if (roomName === room) {
                                // plpSaveDataCard($available, 'price' , '');
                                cy.wrap($available).within(() => {
                                    const selector = platform === 'mobile' ? 'button[type="button"]' : '[data-test="hotel-pdp-reserve-room-button"]'
                                    cy.get(selector).then(($child) => {
                                        cy.wrap($child).first().click();
                                    })
                                })
                                commonTestData.dataOthers.stopIteration = true;
                                cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                            }
                            if ((roomName !== room) && (i + 1 >= $availableCards.length)) {
                                commonTestData.dataOthers.flag = true;
                            }
                        });
                    }
                ).then(() => {
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

export function checkAvailableInfoPax(){
    console.log('check available info in pax')
    // checkDataStatic('hotel-name' , dataProviderHotel.supplier, '','')

}
export function fillPassengerInfo(platform){
    console.log(' fill passenger info in pax')
    cy.scrollTo(0, 1000)
    if (platform === 'mobile') {
        cy.get('select.a-select__select').first().select('male')
    } else {
        paxFillSelectList('gender' , 'male');
    }
    clearAndFillField('namePersian', commonTestData.dataPax.name);
    clearAndFillField('lastNamePersian', commonTestData.dataPax.name);
    clearAndFillField('nationalCode', commonTestData.dataPax.nationalId);
    clearAndFillField('phoneNumber' , commonTestData.dataPax.mobileNumber);
}


export function checkPassengerInfo(){
    console.log('check info passenger in confirm')
    checkDataStatic('owner-cell' , commonTestData.dataPax.name + " " + commonTestData.dataPax.name , '',0);
    checkDataStatic('ownerPhoneNumber-cell' , commonTestData.dataPax.mobileNumber , '',0);
    checkDataStatic('fullName-cell',commonTestData.dataPax.name + " " + commonTestData.dataPax.name , '',0);
    checkDataStatic('code-cell' , commonTestData.dataPax.nationalId,'' ,0);
    checkDataStatic('gender-cell',commonTestData.dataPax.gender,'',0);
}


export function newTabAvailableHotel() {
    cy.url().then(url => {
        const params = new URL(url);
        const destination = params.searchParams.get('destination');
        const sessionId = params.searchParams.get('sessionId');
        const initialSessionId = params.searchParams.get('initialSessionId');
        const cityId = params.searchParams.get("cityId");
        const departingDate = params.searchParams.get('departing');
        const returningDate = params.searchParams.get('returning');
        const newUrl = `${Cypress.env('baseUrl')}hotel/ir-yazd/yazd-dad?destination=${destination}&countryCode=IR&region=dom&departing=${departingDate}&returning=${returningDate}&rooms=30&sessionId=${sessionId}&initialSessionId=${initialSessionId}&cityId=${cityId}`;
        cy.log('newwwwwwww:',newUrl)
        cy.visit(newUrl);
    })
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
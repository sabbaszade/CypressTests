import {commonTestData} from "../../../../data/dataTestCommon";
import {tourTestData} from "../../../../data/dataTestTour";
import {
    checkDataFromFile,
    checkDataStatic,
    fillField,
    paxFillDate,
    paxFillSelectList, paxFillSelectListMobile,
    plpSaveDataCard
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
        method: 'GET',
        url: '/api/v1/tour/available-api/available/plp-hotel-autocomplete*',
        hostname: host
    }).as('getAvailable')
}

export function selectAvailable(platform) {
    if(platform === 'mobile'){
        cy.contains('button', 'مرتب سازی').click();
        cy.contains('span', 'ارزان‌ترین قیمت').click();
    }else {
        cy.get('[data-test="price_asc-tab"]').click()
    }
    const iterateAvailableCards = () => {
        cy.get('.available-card').then(($availableCards) => {
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
                            if (hotelName === tourTestData.dataProvider.supplier) {
                                // plpSaveDataCard($available, 'person-price' , 'strong.text-secondary-400');
                                cy.wrap($available).within(() => {
                                    cy.wait(2000)
                                    newTabAvailableTour(tourTestData.dataProvider.hotelId);
                                    cy.wait(5000);
                                })
                                commonTestData.dataOthers.stopIteration = true;
                                cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                            }
                            if ((hotelName !== tourTestData.dataProvider.supplier) && (i + 1 >= $availableCards.length)) {
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

// export function selectRoom() {
//     const iterateAvailableCards = () => {
//         cy.get('.my-4').then(($availableCards) => {
//             let i = 0;
//             dataOthers.stopIteration = false;
//             const processNextCard = () => {
//                 if (i >= $availableCards.length || dataOthers.stopIteration) {
//                     return;
//                 }
//                 const $available = $availableCards.eq(i);
//                 cy.wrap($available).within(() => {
//                         cy.get('[data-test="room-name"]').then(($child) => {
//                             const roomName = $child.text();
//                             cy.log('room:', roomName)
//                             cy.writeFile('cypress/fixtures/room.json', { roomName: roomName });
//                             if (roomName === dataProviderHotel.roomName) {
//                                 plpSaveDataCard($available, 'price' , '');
//                                 cy.wrap($available).within(() => {
//                                     cy.get('[data-test="select-tour"]').then(($child) => {
//                                         cy.wrap($child).click({force:true});
//                                     })
//                                 })
//                                 dataOthers.stopIteration = true;
//                                 cy.log('stopIteration:', dataOthers.stopIteration);
//                             }
//                             if ((roomName !== dataProviderHotel.roomName) && (i + 1 >= $availableCards.length)) {
//                                 dataOthers.flag = true;
//                             }
//                         });
//                     }
//                 ).then(() => {
//                     if (dataOthers.flag) {
//                         cy.get('[data-test="next-button"]').click({force: true})
//                         cy.wait(5000).then(() => {
//                             dataOthers.flag = false
//                             iterateAvailableCards()
//                         })
//
//                     } else if (!dataOthers.stopIteration) {
//                         i++;
//                         cy.wait(0).then(processNextCard);
//                     }
//                 });
//             };
//             processNextCard();
//         });
//     };
//     iterateAvailableCards();
// }

export function selectRoom(){
    console.log('select type room');
    cy.get('[data-test="price"]').eq(1).then(($child) => {
        const price = $child.text();
        cy.writeFile(`cypress/fixtures/price.json`, {data: price});
    })
    cy.get('[data-test="select-tour"]').eq(1).click();
}

export function checkAvailableInfoPax(){
    console.log('check available info in pax')
    checkDataFromFile('price' , 'price' , '' , 0);

}
export function fillPassengerInfo(platform){
    console.log(' fill passenger info in pax')
    cy.scrollTo(0, 1000)
    fillField('name', commonTestData.dataPax.nameLatin);
    fillField('lastName', commonTestData.dataPax.nameLatin);
    fillField('namePersian', commonTestData.dataPax.name);
    fillField('lastNamePersian', commonTestData.dataPax.name);
    if(platform === 'mobile'){
        paxFillSelectListMobile('gender','1');
    }else{
        paxFillSelectList('gender','1');
    }
    fillField('nationalCode', commonTestData.dataPax.nationalId);
    paxFillDate(0 , 0 , platform);
}

export function checkAvailableInfoConfirm(){
    console.log('check info available in confirm')
    cy.wait('@getOrder', {timeout: 30000})
    checkDataStatic('hotel-name' , tourTestData.dataProvider.supplier , '' , 0);
}

export function checkPassengerInfo(){
    console.log('check info passenger in confirm')
    checkDataStatic('name-cell',commonTestData.dataPax.name + " " + commonTestData.dataPax.name , '',0);
    checkDataStatic('nationalCode-cell' , commonTestData.dataPax.nationalId,'' ,0);
    checkDataStatic('birthdate-cell' , commonTestData.dataPax.birthDate,'',0);
    checkDataStatic('gender-cell',commonTestData.dataPax.gender,'',0);
}

export function checkAvailableMyTrips(){
    console.log('check info order in myTrips')
    checkDataStatic('hotel-name' , tourTestData.dataProvider.supplier , '',0);
    checkDataStatic('destination' , tourTestData.dataHomePage.destination , '',0);
    checkDataFromFile('price' , 'price' , '',0);
    cy.get(`[data-test="order-status"]`).should('have.text', 'نهایی شده');
    cy.contains('[data-test="tab-links-item"]' , 'مسافران').should('exist').click();
    checkDataStatic('full-name-latin' , commonTestData.dataPax.name + ' ' + commonTestData.dataPax.name , '',0);
}

export function otherInfoMyTrips(){
    console.log('check paid price with refund price in myTrips')
    checkDataFromFile('price-total' , 'price' , '', 0);
}

export function newTabAvailableTour(id) {
    cy.url().then(url => {
        const urlSections = url.split('?')
        const newUrl = [urlSections[0], `/${id}?`, urlSections[1]].join('')
        cy.visit(newUrl);
    })
}

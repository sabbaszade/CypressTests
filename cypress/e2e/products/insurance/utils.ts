import {commonTestData} from "../../../../data/dataTestCommon";
import {insuranceTestData} from "../../../../data/dataTestInsurance";
import {
    plpSaveDataCard,
    paxFillDate,
    paxFillSelectList,
    checkDataFromFile,
    checkDataStatic,
    fillField,
    clickButton, paxFillSelectListMobile
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
        url: '/api/v2/insurance/international/detailed-order-proposals*',
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
                        cy.get('[data-test="available-title"]').then(($child) => {
                            const title = $child.text()
                            cy.writeFile('cypress/fixtures/provider.json', { title: title });
                            if (title === insuranceTestData.dataTitle.title) {
                                if ($available.hasClass('is-disabled')) {
                                    commonTestData.dataOthers.flag = true;
                                } else {
                                    plpSaveDataCard($available, 'available-title' , '');
                                    plpSaveDataCard($available, 'provider', '');
                                    // plpSaveDataCard($available, 'financial-commitment' , '');
                                    plpSaveDataCard($available, 'helping-company' , '');
                                    if(platform === 'mobile'){
                                        plpSaveDataCard($available, 'price' , '');
                                    }else{
                                        plpSaveDataCard($available, 'item-price' , 'strong.text-secondary-400');
                                    }
                                    cy.wrap($available).within(() => {
                                        cy.get('[data-test="item-button"]').then(($child) => {
                                            cy.wait(1000);
                                            cy.wrap($child).click({force:true});
                                        })
                                    })
                                    commonTestData.dataOthers.stopIteration = true;
                                    cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                                }
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
            });
    };
    iterateAvailableCards();
}


export function checkAvailableInfoPax(platform){
    console.log('check available info in pax')
    if(platform === 'mobile'){
        clickButton('toggle-price')
        cy.readFile(`cypress/fixtures/provider.json`).then((data) => {
            cy.get(`.text-1.text-grays-300`).should('contain.text', data.data)
        });
    }else{
        checkDataFromFile('provider' , 'provider' , '', 0);
    }
    checkDataFromFile('price-details' , 'price' , 'strong' , 0);
    checkDataStatic('destination' ,insuranceTestData.dataHomePage.destination , '', 0);
    checkDataStatic('available-title' , insuranceTestData.dataTitle.title , '', 0);
    // checkDataFromFile('financial-commitment' , 'financial-commitment' , '', 0);
    checkDataFromFile('helping-company' , 'helping-company' , '', 0);
}

export function fillPassengerInfo(platform){
    console.log(' fill passenger info in pax')
    cy.scrollTo(0, 1000);
    if(platform === 'mobile'){
        paxFillSelectListMobile('gender' , 'male');
    }else{
        paxFillSelectList('gender','male');
    }
    fillField('name' , commonTestData.dataPax.nameLatin);
    fillField('lastName' , commonTestData.dataPax.nameLatin);
    fillField('nationalCode' , commonTestData.dataPax.nationalId);
    paxFillDate(0 , 1 , platform);
    paxFillDate(1 , 0 , platform);
    fillField('passportNumber' , commonTestData.dataPax.passportNumber);
    if(platform === 'mobile'){
        paxFillSelectListMobile('visa-type' , 'Single');
    }else{
        paxFillSelectList('visa-type','Single');
    }

}

export function checkAvailableInfoConfirm(){
    console.log('check info available in confirm')
    cy.wait('@getOrder', {timeout: 30000})
    checkDataFromFile('insurerNamePersian-cell' , 'provider' , '' , 0);
    checkDataStatic('destinationName-cell' , insuranceTestData.dataHomePage.destination , '' , 0);
    // checkDataFromFile('coverTotalLimit-cell' , 'financial-commitment' , '',0);
    checkDataFromFile('assistance-cell' , 'helping-company' , '',0);
}

export function checkPassengerInfo(){
    console.log('check info passenger in confirm')
    checkDataStatic('fullName-cell',commonTestData.dataPax.nameLatin + " " + commonTestData.dataPax.nameLatin ,'' ,0);
    checkDataStatic('gender-cell',commonTestData.dataPax.gender,'',0);
    checkDataStatic('passportNumber-cell' , commonTestData.dataPax.passportNumber , '',0);
    checkDataStatic('birthdate-cell' , commonTestData.dataPax.birthDateMiladi,'',0);
    checkDataFromFile('price-cell' , 'price' , '',0);
    checkDataStatic('contact-phone' , Cypress.env('username'),'',0);
    checkDataStatic('contact-email' , Cypress.env('email'),'',0);
}
export function checkAvailableMyTrips(){
    console.log('check info order in myTrips')
    checkDataFromFile('hotel-name' , 'provider' , '',0);
    // checkDataStatic('destination' , dataHomePageInsurance.destination ,'', 0);
    cy.get(`[data-test="order-status"]`).should('have.text', 'نهایی شده');
    checkDataFromFile('price' , 'price' , '',0);
}
export function otherInfoMyTrips(){
    console.log('check paid price with refund price and order info in myTrips')
    checkDataStatic('full-name' , commonTestData.dataPax.nameLatin + ' ' + commonTestData.dataPax.nameLatin , '' , 0);
    checkDataFromFile('price-total' , 'price' , '' , 0);
    checkDataFromFile('price-refund' , 'price' , '' , 0);
}
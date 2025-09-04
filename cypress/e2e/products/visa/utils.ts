import {checkDataFromFile, clickButton, fillField, paxFillDate, paxFillSelectList, search} from "../../general";
import {commonTestData} from "../../../../data/dataTestCommon";

export function searchVisa(vertical  , destination , platform){
    console.log('select vertical Tab')
    cy.wait(3000);
    clickButton(vertical);
    cy.wait(3000);
    if(platform === 'mobile'){
        cy.get(`[data-test="destination"] input`).click({force: true}).type(destination , {force:true}).wait(1000);
        cy.get('.destination-item span.truncate').first().click({force: true});
    }else{
        cy.get(`[data-test="destination"] input`).click().wait(1000).type(destination).wait(2000).type('{enter}');
    }
    clickButton('search');
}
export function pdpPage(platform){
    console.log('select type visa and go to pax')
    if(platform === 'mobile'){
        paxFillSelectList('visa-form' , 'd180-multi-invitaion');
    }else{
        paxFillSelectList('visa-type' , 'd180-multi-invitaion');
    }
    cy.get('[data-test="price"]').eq(0).then(($child) => {
        const price = $child.text();
        cy.writeFile(`cypress/fixtures/price.json`, {data: price});
    });
    clickButton('request-visa');
}


export function checkAvailableInfoPax(){
    console.log('check available info in pax')
    cy.readFile(`cypress/fixtures/price.json`).then((data) => {
        cy.get(".text-secondary-400").eq(0).should('contain.text', data.data)
    });
}
export function fillPassengerInfo(platform){
    console.log(' fill passenger info in pax')
    cy.scrollTo(0, 1000)
    fillField('firstName', commonTestData.dataPax.nameLatin);
    fillField('lastName', commonTestData.dataPax.nameLatin);
    fillField('mobile', commonTestData.dataPax.mobileNumber);
    fillField('email', Cypress.env('email'));
    fillField('passportNumber', commonTestData.dataPax.passportNumber);
    paxFillDate(0 , 2 , platform);

    cy.fixture('sample.png').then(fileContent => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png');
        const file = new File([blob], 'sample.png', { type: 'image/png' });
        cy.get('#inputFile').attachFile({
            fileContent: file,
            fileName: 'sample.png',
            mimeType: 'image/png',
        });
    });
}

export function checkPricePax(){
    console.log('check price in pax');
    checkDataFromFile('price' , 'price', '' , 0 );
    // cy.get('[type="submit"]').click();
}
import {commonTestData} from "../../../../data/dataTestCommon";
import {accommodationTestData} from "../../../../data/dataTestAccommodation";
import {checkDataFromFile, clickButton, fillField} from "../../general";


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
        url: '/api/v2/accommodation/Available/Search',
        hostname: host
    }).as('getAvailable')
}


export function selectAvailable() {
    cy.wait(4000)
    const iterateAvailableCards = () => {
        cy.get('.available-card').then(($availableCards) => {
            let i = 0
            const processNextCard = () => {
                if (i >= $availableCards.length || commonTestData.dataOthers.stopIteration) {
                    return;
                }
                const $available = $availableCards.eq(i);
                cy.wrap($available).within(() => {
                        cy.get('.available-card__title').then(($child) => {
                            const accommodation = $child.text();
                            cy.log('accommodation:', accommodation)
                            if ((accommodation.includes(accommodationTestData.dataHomePage.accommodationName)) ) {
                                cy.get('.available-card__price strong').then(($child) => {
                                    cy.writeFile('cypress/fixtures/price.json', { data: $child.text() });
                                })
                                cy.wrap($available).within(() => {
                                    cy.wait(2000)
                                    newTabAvailableAccommodation(accommodationTestData.dataHomePage.id);
                                    cy.wait(5000);
                                })
                                commonTestData.dataOthers.stopIteration = true;
                                cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                            }
                            if ((accommodation !== accommodationTestData.dataHomePage.accommodationName) && (i + 1 >= $availableCards.length)) {
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



export function newTabAvailableAccommodation(id) {
    // cy.visit('https://hydranightly.indraproject.ir/accommodation/pdp/villa-48?checkin=1403-01-15&checkout=1403-01-16&count=1&city=city-ramsar&keyword=%D8%A7%D8%AC%D8%A7%D8%B1%D9%87+%D9%88%DB%8C%D9%84%D8%A7+%D9%88+%D8%B3%D9%88%D8%A6%DB%8C%D8%AA+%D8%AF%D8%B1+%D8%B1%D8%A7%D9%85%D8%B3%D8%B1')
    cy.url().then(url => {
        const params = new URL(url);
        const checkin = params.searchParams.get('checkin');
        const checkout = params.searchParams.get('checkout');
        const count = params.searchParams.get('count');
        const city = params.searchParams.get('destination');
        const newUrl = `${Cypress.env('baseUrl')}accommodation/pdp/${id}?checkin=${checkin}&checkout=${checkout}&count=${count}&city=${city}`;
        // cy.log('newwwwwwww:',newUrl)
        cy.visit(newUrl);
        cy.get('[data-test="reserve"]').click();
        // cy.ignoreImages(newUrl)

    })
}

export function checkInfoPdp(platform) {
    console.log('check info pdp page and go to pax')
    if (platform === 'mobile') {
        cy.visit(`${Cypress.env('baseUrl')}accommodation/pdp/villa-48?checkin=1403-05-29&checkout=1403-05-30&count=1&city=city-ramsar`)
        cy.wait(5000);
        cy.writeFile('cypress/fixtures/price.json', { data: '1,000' })
        cy.get('button.btn.is-md.is-solid-secondary.w-full').contains('ارسال درخواست رزرو').click({ force: true });
    } else {

        if (platform === 'b2b') {
            cy.visit(`${Cypress.env('baseUrlB2b')}accommodation/pdp/villa-48?checkin=1403-05-29&checkout=1403-05-30&count=1&city=city-ramsar`)
        }
        if (platform === 'b2c') {
            cy.visit(`${Cypress.env('baseUrl')}accommodation/pdp/villa-48?checkin=1403-05-29&checkout=1403-05-30&count=1&city=city-ramsar`)
        }
        cy.wait(5000);
        cy.writeFile('cypress/fixtures/price.json', { data: '1,000' })
        // cy.get('[dataTest = "price"]').first().then(($child) => {
        //     cy.writeFile('cypress/fixtures/price.json', { data: $child.text() });
        // })
        // checkDataFromFile('price-detail' , 'price' , '' , 0);
        // checkDataFromFile('price' , 'price' , '' , 1);
        cy.wait(2000);
        cy.get('[data-test="reserve"]').click({ force: true });
    }
}

export function checkAvailableInfoPax(platform) {
    console.log('check available info in pax')
    if (platform === 'mobile') {
        cy.readFile(`cypress/fixtures/price.json`).then((data) => {
            cy.xpath('//strong[@class="text-secondary-400 text-6 ml-1" and @data-test="price"]').should('contain', data.data);

        });

    }
    else {
        checkDataFromFile('price-detail', 'price', 'strong', 0);
        checkDataFromFile('price-total', 'price', 'strong', 0);
        checkDataFromFile('price-final', 'price', 'strong', 0);
    }
}

export function fillPassengerInfo(){
    console.log(' fill passenger info in pax')
    fillField('namePersian', commonTestData.dataPax.name);
    fillField('lastNamePersian', commonTestData.dataPax.name);
    fillField('phoneNumber' , commonTestData.dataPax.mobileNumber);

}

export function checkAvailableMyTrips(){
    console.log('check info order in myTrips')
    checkDataFromFile('price' , 'price' , '',0);
}

export function otherInfoMyTrips(){
    console.log('check paid price with refund price in myTrips')
    checkDataFromFile('price-total' , 'price' , '', 0);
    checkDataFromFile('price-refund' , 'price' , '', 0);
}
import { checkDataFromFile, checkDataStatic, clickButton, fillField, newTabAvailableGtour, plpSaveDataCard, paxFillDate, paxFillSelectList, paxFillSelectListMobile } from "../../general";
import { commonTestData } from "../../../../data/dataTestCommon";
import { gTourTestData } from "../../../../data/dataTestGTour";


export function apiAvailable(platform) {
    let host;
    if (platform === 'b2b') {
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'GET',
        url: '/api/group-tours?*',
        hostname: 'hydra-cms.indraproject.ir',
    }).as('getAvailable')
}



export function selectAvailable(platform = 'desktop') {
    cy.wait(2000)
    const iterateAvailableCards = () => {
        cy.get(platform === 'mobile' ? '.available-card' : '.gtour-available-card').then(($availableCards) => {
            let i = 0
            const processNextCard = () => {
                if (i >= $availableCards.length || commonTestData.dataOthers.stopIteration) {
                    return;
                }
                const $available = $availableCards.eq(i);
                cy.wrap($available).within(() => {
                    if (platform == 'desktop') {
                        const selector = '[data-test="tour-name"]'
                        cy.get(selector).then(($child) => {
                            const tourName = $child.text();
                            cy.log('tour:', tourName)
                            if (tourName === gTourTestData.dataProvider.tour) {
                                // plpSaveDataCard($available, 'price', '');
                                cy.wrap($available).within(() => {
                                    newTabAvailableGtour(platform);
                                })
                                commonTestData.dataOthers.stopIteration = true;
                                cy.log('stopIteration:', commonTestData.dataOthers.stopIteration);
                            }
                            if ((tourName !== gTourTestData.dataProvider.tour) && (i + 1 >= $availableCards.length)) {
                                commonTestData.dataOthers.flag = true;
                            }
                        });
                    } else {
                        newTabAvailableGtour(platform);
                    }
                }).then(() => {
                    if (commonTestData.dataOthers.flag) {
                        cy.get('.available-card button.is-solid-secondary.w-full').click({ force: true })
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

export function selectTour() {
    console.log('select count passengers and tour');
    clickButton('count-passengers');
    cy.get('[aria-label="افزودن"]').click();
    // checkDataFromFile('price', 'price', '', 0);
    clickButton('select-count', true);
}

export function checkAvailableInfoPax() {
    console.log('check available info in pax')
    // checkDataFromFile('price', 'price', '', 0);

}
export function fillPassengerInfo(platform) {
    console.log(' fill passenger info in pax');
    cy.scrollTo(0, 1000);
    fillField('name', commonTestData.dataPax.nameLatin);
    fillField('lastName', commonTestData.dataPax.nameLatin);
    if (platform === 'mobile') {
        paxFillSelectListMobile('gender', 'male');
    } else {
        paxFillSelectList('gender', 'male');
    }
    fillField('nationalCode', commonTestData.dataPax.nationalId);
    fillField('namePersian', commonTestData.dataPax.name);
    fillField('lastNamePersian', commonTestData.dataPax.name);
    paxFillDate(0, 0, platform);
    fillField('phoneNumber', commonTestData.dataPax.mobileNumber);
}

export function checkPassengerInfo() {
    console.log('check info passenger in confirm')
    checkDataStatic('fullname-cell', commonTestData.dataPax.name + " " + commonTestData.dataPax.name, '', 0);
    checkDataStatic('gender-cell', commonTestData.dataPax.gender, '', 0);
    checkDataStatic('nationalCode-cell', commonTestData.dataPax.nationalId, '', 0);
    checkDataStatic('birthday-cell', commonTestData.dataPax.birthDateDash, '', 0);
}

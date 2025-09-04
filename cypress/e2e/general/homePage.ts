import { commonTestData } from "../../../data/dataTestCommon";
import { login, clickButton } from "./index";

export function signIn(platform) {
    console.log('clear the cache');
    Cypress.env('clearCacheFlag', true);
    cy.clearCacheIfNeeded();
    console.log('login to website');
    loadWebsite(platform);
    login(platform);
}

export function signInNightly(platform) {
    console.log('clear the cache');
    Cypress.env('clearCacheFlag', true);
    cy.clearCacheIfNeeded();
    console.log('login to website');
    loadWebsiteNightly(platform);
    login(platform);
}

export function search(vertical, origin, destination, isReturnTrip, platform, verticalMobile) {
    if (platform === 'mobile') {
        console.log('select vertical Tab')
        cy.wait(3000);
        if (vertical === 'group-tour') {
            clickButton('tour');
            cy.wait(2000)
        }

        clickButton(verticalMobile);

        cy.wait(2000)
        if (vertical == 'iranout-tab') {
            clickButton('iranout')
            cy.wait(2000)
        }
        console.log('select origin , destination ');
        if (origin !== 'noHaving') {
            searchCity('origin', origin, vertical, platform);
        }
        cy.wait(1000);
        if (vertical === 'group-tour') {
            cy.wait(1000);
            searchCityGtour('destination', destination, vertical, platform);
            cy.wait(1000);

        } else {
            searchCity('destination', destination, vertical, platform);
            cy.wait(1000);
            if (isReturnTrip !== 'noHaving') {
                datePicker(isReturnTrip, platform);
            }
        }
        if (verticalMobile === 'hotel') {
            return cy.getByTestId('hotel-search-passengers-submit-button').click()
        }
        if (verticalMobile == 'tour') {

            cy.get('[aria-label="کاستن"]').first().click({ force: true });
            cy.get('[data-test="hotel-search-passengers-submit-button"]').click();
        }
        if ((verticalMobile !== 'bus') && (verticalMobile !== 'tour') && (verticalMobile !== 'travel-insurance') && (verticalMobile !== 'gtour') && (verticalMobile !== 'accommodation') ) {

            clickButton('submit-passengers');

        }
        if (vertical === 'train-tab') {
            cy.contains('button', 'جستجوی قطار').click();
        }
        if (vertical == 'iranout-tab') {
            clickButton('search')
        }
        if (vertical === 'travel-insurance') {
            cy.get('.duration-item').contains('span', '۱ تا ۴ روز').click({ force: true })
            // cy.get('ul.a-menu').contains('span', '۱ تا ۴ روز').click({force:true});
            // clickButton('count-passengers');
            cy.contains('.flex.w-full.items-center.justify-between.mb-4', '۰ تا ۱۲ سال').find('button[aria-label="افزودن"]').click();
            cy.contains('button', 'تایید و جستجو - 1 مسافر').click()
        }
        if (verticalMobile === 'accommodation') {
            cy.get('button[type="submit"]').click();
        }
    }
    else {
        console.log('select vertical Tab')
        cy.wait(3000);
        clickButton(vertical);
        cy.wait(2000)
        console.log('select origin , destination ')
        if (origin !== 'noHaving') {
            cy.wait(1000);
            searchCity('origin', origin, vertical, platform);
            cy.wait(2000);
        }
        if (vertical === 'hotel-tab') {
            searchCity('hotel-search-destination-input', destination, vertical, platform);
        } else {
            searchCity('destination', destination, vertical, platform);
        }
        cy.wait(4000);
        console.log('select date')
        if (isReturnTrip !== 'noHaving') {
            datePicker(isReturnTrip, platform);
        }
        if (vertical === 'tour-tab') {
            cy.get('[data-test="submit-date"]').click();
            cy.wait(1000);
            cy.get('[aria-label="کاستن"]').first().click({ force: true });
        }
        if (vertical === 'travel-insurance') {
            clickButton('duration-travel');
            cy.get('[data-test="duration-travel"] ul').contains('span', '۱ تا ۴ روز').click();
            clickButton('count-passengers');
            cy.contains('.flex.w-full.items-center.justify-between.mb-4', '۰ تا ۱۲ سال').find('button[aria-label="افزودن"]').click();
        }
        console.log('click on search button')

        if (vertical === (('hotel-tab'))) {
            // clickButton('hotel-search-submit-button');
            cy.get(`[data-test="hotel-search-submit-button"]`).click();

                    } else {
            clickButton('search');
        }
        if (vertical !== ('visa')) {
            cy.wait('@getAvailable', { timeout: 120000 })

        }
    }

}
export function searchCityGtour(route, city, vertical, platform) {
    if (platform === 'mobile') {

        cy.wait(2000)
        cy.get(`[data-test="${route}"] input`).eq(0).click({ force: true }).wait(1000);
        cy.get(`[data-test="${route}"] input`).eq(1).click({ force: true }).type(city).wait(1000);

        cy.get('li.cursor-pointer span.flex').first().click({ force: true });
    } else {

        cy.get(`[data-test="${route}"] input`).wait(1000).clear({ force: true }).type(city).wait(3000).type('{enter}')


    }

}


export function loadWebsite(platform) {
    if (platform === 'mobile') {
        cy.intercept('GET', '**/*', (req) => {
            req.headers['user-agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
            // req.headers['x-custom-header'] = 'mobile-view';
        }).as('setUserAgent');
        cy.visit(Cypress.env('baseUrl')
        )
    } else if (platform === 'b2b') {
        cy.visit(Cypress.env('baseUrlB2b'))
    } else {
        cy.visit(Cypress.env('baseUrl'))

    }
}

export function loadWebsiteNightly(platform) {
    if (platform === 'mobile') {
        cy.intercept('GET', '**/*', (req) => {
            req.headers['user-agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
            // req.headers['x-custom-header'] = 'mobile-view';
        }).as('setUserAgent');
        cy.visit(Cypress.env('baseUrlStage'), {
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 13; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
            }
        })
    }


    if (platform === 'b2c') {
        cy.visit(Cypress.env('baseUrlStage'))
    }
    if (platform === 'b2b') {
        cy.visit(Cypress.env('baseUrlB2b'))
    }

}

export function searchCity(route, city, vertical, platform) {
    if (platform === 'mobile') {
        if (route === 'origin') {
            cy.get(`[data-test="${route}"] input`).click({ force: true });
        }
        cy.wait(2000)
        if (route === 'destination' && vertical === "iranout-tab") {
            cy.get(`[data-test="${route}"]`).eq(1).click({ force: true }).type(city).wait(1000);
        }
        else if ( vertical === 'travel-insurance') {
            cy.get(`[name="کشور مقصد"]`).click({ force: true }).type(city, { force: true }).wait(1000);
        }
        else if (route === 'destination' && vertical === 'accommodation-tab') {
            cy.xpath(`//label[contains(text(),'مقصد یا نوع اقامتگاه')]`).click({ force: true }).wait(1000);
            cy.xpath('/html/body/div/div[2]/div/div[2]/div/div/input').click({ force: true }).type(city, { force: true }).wait(1000);
        }
        else if (vertical === 'hotel-tab') {
            cy.getByText('label', 'مقصد یا هتل (داخلی و خارجی)').click()
            cy.get('.is-searchable.a-select input').type(city, { force: true }).wait(1000);
            return cy.get('a[role="listitem"] > .destination-item').first().click()
        }
        else{
            cy.get(`[data-test="${route}"] input`).eq(1).click({force: true}).type(city).wait(1000);

        }
        cy.get('.destination-item span.truncate').first().click({ force: true });

    } else {
        if (vertical === 'travel-insurance') {
            cy.get(`[data-test="${route}"] input`).wait(1000).type(city).wait(3000).type('{enter}')
        } else {
            cy.get(`[data-test="${route}"] input`).wait(1000).clear({ force: true }).type(city).wait(3000).type('{enter}')

        }
    }

}

export function datePicker(sweep, platform) {
    if (platform !== 'mobile') {
        cy.get('[data-test="departure-date"] input').click({ force: true });
    }
    cy.get('.is-today').children('span').then($res => {
        let $date = parseInt($res.text())
        if ($date + commonTestData.dataOthers.tempDay > 30) {
            let $departure = ($date + commonTestData.dataOthers.tempDay) - 30;
            cy.get(':nth-child(2) > .calendar-grid').children().contains($departure).click()  //go
            if (sweep) {
                cy.get(':nth-child(2) > .calendar-grid').children().contains($departure + 1).click()  //return
            }
        } else {
            cy.get(':nth-child(1) > .calendar-grid').children().contains($date + commonTestData.dataOthers.tempDay).click()  //go
            if (sweep) {
                cy.get(':nth-child(1) > .calendar-grid').children().contains($date + commonTestData.dataOthers.tempDay + 1).click()   //return
            }
        }
        // click_button('search');
        // cy.wait('@getAvailable', {timeout: 120000})
    })
    if (platform === 'mobile') {
        cy.get('[data-test="submit-date"]').click({ force: true });
    }
}




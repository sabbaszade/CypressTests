import RequestOptions = Cypress.RequestOptions;
import {delay} from "rxjs";

export const sep = () => {
    cy.origin('https://sep.shaparak.ir', async () => {
        const antiCaptcha = Cypress.require("./antiCaptcha")
        cy.wait(4000);
        cy.get('[data-name="PanNumber"]').type(Cypress.env('cardNumber'));
        cy.get('[data-name="Cvv2"]').type(Cypress.env('cvv2'));
        cy.get('[data-name="Month"]').type(Cypress.env('monthExpire'));
        cy.get('[data-name="Year"]').type(Cypress.env('yearExpire'));
        cy.get('#CaptchaImage').should('have.attr', 'src').then((src) => {
            const base64Data = src.split('base64,')[1];
            antiCaptcha.solveCaptcha(base64Data).then((result) => {
                console.log({result})
                if (result) {
                    cy.get('[data-name="CaptchaInputText"]').type(result);
                    cy.get('[data-name="Pin2"]').type(Cypress.env('pin2'));
                    // cy.get('[name="Purchase"]').click({ force: true });
                }

            });
        });
    });
}

export const sadad = () =>  {
    cy.origin(new URL('https://sadad.shaparak.ir').origin, () => {
        cy.on('uncaught:exception', (e) => {
            if (e.message.includes("Failed to set the 'href' property on 'Location'")) {
                // We expected this error, so let's ignore it and let the test continue
                return false;
            }
            if (e.message.includes("Cannot read properties of undefined (reading 'indexOf')")) {
                return false; // Expected error, ignore it
            }
        });
         const antiCaptcha = Cypress.require("./antiCaptcha")
            cy.wait(4000);
            cy.get('#CardNoPart1').type(Cypress.env('cardNumber') , { delay : 500})
            cy.wait(3000);
            cy.get('#Cvv2').type('{backspace}').type(Cypress.env('cvv2'));
            cy.get('#Month').type(Cypress.env('monthExpire'));
            cy.get('#Year').type(Cypress.env('yearExpire'));
            cy.get('.payment-captcha').should('have.attr', 'src').then((src) => {
                const base64Data = src.split('base64,')[1];
                antiCaptcha.solveCaptcha(base64Data).then((result) => {
                    console.log({result})
                    if (result) {
                        cy.wait(1000)
                        cy.get('#Captcha').eq(0).type(result);
                        cy.wait(1000)
                        cy.get('#Pin').type(Cypress.env('pin2'));
                        // cy.get('#payButton').click({force: true});
                    }
                });
            });
        });
    }

//tic
    export function iranKish() {
        cy.origin('https://ikc.shaparak.ir/', () => {
            const antiCaptcha = Cypress.require("./antiCaptcha")
            cy.wait(4000);
            cy.get('[type="tel"]').eq(0).type(Cypress.env('cardNumber'));
            cy.get('[type="tel"]').eq(1).type(Cypress.env('cvv2'));
            cy.get('[type="tel"]').eq(2).type(Cypress.env('monthExpire'));
            cy.get('[type="tel"]').eq(3).type(Cypress.env('yearExpire'));
            cy.get('.q-ml-sm > .q-img > .q-img__container > .q-img__image').should('have.attr', 'src').then((src) => {
                const base64Data = src.split('base64,')[1];
                antiCaptcha.solveCaptcha(base64Data).then((result) => {
                    console.log({result})
                    if (result) {
                        cy.get('[type="tel"]').eq(4).type(result);
                        cy.get('[type="tel"]').eq(5).type(Cypress.env('pin2'));
                        // cy.contains('پرداخت').should('exist').click({force: true});
                    }
                });
            });
        });
    }

    export function tap(newUrlTap) {
        cy.log('aaaaaaaaaaaaaaaaaaaaaaaaaaa')
        cy.origin(new URL(newUrlTap).origin, async () => {
            cy.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
            const antiCaptcha = Cypress.require("./antiCaptcha")
            cy.wait(4000);
            cy.get('#pan').type(Cypress.env('cardNumber'));
            cy.get('#cvv2').type(Cypress.env('cvv2'));
            cy.get('#txtExpM').type(Cypress.env('monthExpire'));
            cy.get('#txtExpY').type(Cypress.env('yearExpire'));
            cy.get('#imgc1').should('have.attr', 'src').then((src) => {
                return cy.request({
                    url: 'https://pec.shaparak.ir/NewIPG/' + src,
                    encoding: "base64"
                } as RequestOptions).then((response) => {
                    cy.log('ressssss:', response.body)
                    antiCaptcha.solveCaptcha(response.body).then((result) => {
                        console.log({result})
                        if (result) {
                            cy.get('#Captcha').type(result);
                            cy.get('#pin2').type(Cypress.env('pin2'));
                            // cy.get('#btnPayment').click({force: true});
                        }
                    });
                });
            });
        });
    }


    export function mellat() {

        cy.origin('https://bpm.shaparak.ir', () => {
            const antiCaptcha = Cypress.require("./antiCaptcha")
            cy.wait(4000);
            cy.get('#cardnumber').type(Cypress.env('cardNumber'));
            cy.get('#inputcvv2').type(Cypress.env('cvv2'));
            cy.get('#inputmonth').type(Cypress.env('monthExpire'));
            cy.get('#inputyear').type(Cypress.env('yearExpire'));
            cy.get('#captcha-img').should('have.attr', 'src').then((src) => {
                return cy.request({
                    url: 'https://bpm.shaparak.ir/pgwchannel/' + src,
                    encoding: "base64"
                } as RequestOptions).then((response) => {
                    cy.log('ressssss:', response.body)
                    antiCaptcha.solveCaptcha(response.body).then((result) => {
                        console.log({result})
                        if (result) {
                            cy.get('#inputcaptcha').type(result);
                            cy.get('#inputpin').type(Cypress.env('pin2'));
                            // cy.get('#payButton').click({force: true});
                        }

                    });
                });


            });
        });
    }

    export function novin() {
        cy.origin('https://pna.shaparak.ir', () => {
            const antiCaptcha = Cypress.require("./antiCaptcha")
            cy.wait(4000);
            cy.get('#CardNumber').type(Cypress.env('cardNumber'));
            cy.get('#Cvv2').type(Cypress.env('cvv2'));
            cy.get('#ExpireMonth').type(Cypress.env('monthExpire'));
            cy.get('#ExpireYear').type(Cypress.env('yearExpire'));
            cy.get('#img-captcha').should('have.attr', 'src').then((src) => {
                antiCaptcha.solveCaptcha(src).then((result) => {
                    console.log({result})
                    if (result) {
                        cy.get('#Captcha').type(result);
                        cy.get('#Pin2').type(Cypress.env('pin2'));
                        // cy.get('#payment-button').click({force: true});
                    }
                });
            });
        });
    }


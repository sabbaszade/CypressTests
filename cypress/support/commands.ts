import 'cypress-file-upload';
import 'cypress-iframe';
export  let Buffer;

declare global {
    namespace Cypress {
        interface Chainable<Subject = any> {
            clearCacheIfNeeded: () => void;
            terminateOnFailure: () => void;
            clearBrowserCache: () => void;
            sep: () => void;
            ignoreImages: (url) => void;
            getByTestId(selector: string): void
            getByText(tag: string, text: string): Chainable<JQuery<HTMLElement>>;
            // convertImageToBase64(imagePath: string): Chainable<string>;
        }
    }
}

// Cypress.Commands.add('convertImageToBase64', (imagePath) => {
//     return cy.readFile(imagePath, 'binary').then((imageContent) => {
//         const base64Image = Buffer.from(imageContent, 'binary').toString('base64');
//         return base64Image;
//     });
// });


Cypress.Commands.add('ignoreImages', (url) => {
    cy.visit(url);
    cy.window().then(win => {
        win.document.querySelectorAll('img').forEach(img => img.remove());
    });
});

// Cypress.Commands.add('sep', () => {
//     cy.origin('https://sep.shaparak.ir', () => {
//         cy.wait(4000);
//         x();
//     });
// });

Cypress.on('uncaught:exception', (err, runnable) => {
    // Prevent Cypress from failing subsequent tests and continue
    return false;
});

Cypress.Commands.add('clearCacheIfNeeded', () => {
    // Clear browser cache
    if (Cypress.env('clearCacheFlag')) {
        cy.clearCookies();
        cy.clearLocalStorage();
        Cypress.env('clearCacheFlag', false);
    }
    cy.log('Clearing browser cache...');

});
Cypress.Commands.add('clearBrowserCache', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
    cy.log('Clearing browser cache...');

});


//
// Cypress.Commands.add('solveCaptcha', (base64Data) => {
//     return  cy.request({
//         method: 'POST',
//         url: 'https://api.anti-captcha.com/createTask',
//         body: {
//             clientKey: '14e6b60d18085ade8c9983a228f91520',
//             task: {
//                 type: 'ImageToTextTask',
//                 body: base64Data,
//                 phrase: null,
//                 case: null,
//                 numeric: null,
//                 comment: null,
//                 math: null,
//                 minLength: null,
//                 maxLength: null,
//             },
//             languagePool: null,
//             softId: 0,
//         },
//     }).then((response) => {
//         if (response.body.taskId) {
//             const taskId = response.body.taskId;
//             cy.wait(5000);
//             return cy.request({
//                 method: 'POST',
//                 url: 'https://api.anti-captcha.com/getTaskResult',
//                 body: {
//                     clientKey: '14e6b60d18085ade8c9983a228f91520',
//                     taskId: taskId,
//                 },
//             }).then((res) => {
//                 const result = res.body.solution.text;
//                 return result;
//             });
//         } else {
//             throw new Error('ERROR_NO_SLOT_AVAILABLE');
//         }
//     });
// });



// Cypress.Commands.add('terminateOnFailure', () => {
//     Cypress.runner.stop(); // This stops the entire test suite
// });

Cypress.Commands.add('getByTestId', (selector: string) => {
return cy.get(`[data-test=${selector}]`)
})

Cypress.Commands.add('getByText', (tag: string, text: string) => {
    return cy.get(tag).contains(text)
})

export default class convertImageToBase64 {
}
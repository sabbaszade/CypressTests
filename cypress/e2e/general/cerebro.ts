
export function signInCrybro(vertical , platform){
    console.log('login to crybro and select Order purchased')
    if(platform === 'b2b'){
        cy.fixture('dataOrder.json').then(order => {
            cy.visit(Cypress.env('baseUrlCerybro') + `/orders/${vertical}/${order.data}`);
                cy.get('#loginEmail').click({force:true}).type(Cypress.env('email-cerybro'));
                cy.get('#loginPass').click({force:true}).type(Cypress.env('password-cerybro'));
                cy.get('.btn-lg').click();
            })
    }else{
        cy.fixture('dataOrder.json').then(order => {
            cy.viewport(1366, 768);
            cy.visit(Cypress.env('baseUrlCerybro') + `/orders/${vertical}/${order.data}`);
            cy.origin(Cypress.env('baseUrlCerybro') , () => {
                cy.get('#loginEmail').click({force:true}).type(Cypress.env('email-cerybro'));
                cy.get('#loginPass').click({force:true}).type(Cypress.env('password-cerybro'));
                cy.get('.btn-lg').click();
            })
        })
    }

}

export function loginCerybro(){
    cy.get('#loginEmail').click({force:true}).type(Cypress.env('email-cerybro'));
    cy.get('#loginPass').click({force:true}).type(Cypress.env('password-cerybro'));
    cy.get('.btn-lg').click();
}

// export function submitRefund(){
//     Cypress.on('uncaught:exception', (err, runnable) => {
//         // Return false to prevent Cypress from failing the test
//         return false;
//     });
//     cy.origin(Cypress.env('baseUrlCerybro'), () => {
//         cy.wait(5000)
//         cy.get('[data-name="moreInformation"]').click();
//         cy.get('[data-test="passenger-card"]').click();
//         cy.get('[data-test="btn-refund"]').click();
//         cy.get(':nth-child(1) > .input-wrapper > [append=""] > .multiselect > .multiselect__tags').click().type('استرداد مطابق قوانین کنسلی قطار').wait(5000).type('{enter}');
//         cy.get(':nth-child(2) > .input-wrapper > [append=""] > .multiselect > .multiselect__tags').click().type('حساب کاربر').wait(3000).type('{enter}');
//         cy.get('[data-test="btn-submit-refund"]').click();
//     })
// }

export function refundManual(platform){
    if(platform === 'b2b'){
            console.log('manual refund in crybro')
            cy.contains('.nav-link', 'استرداد').click();
            cy.get('[data-name="refundRequestId"]').click();
            cy.get('.tab_heading-title').eq(6).click({force: true});  //4
            cy.contains('button.btn-outline-primary', 'عملیات‌ها').click();
            cy.get('[data-test="submitRefundInfo"]').click();
            cy.wait(10000)
            cy.get('[data-test="penalty"]').eq(0).type("0");
            cy.get('[data-test="penalty"]').eq(1).type("0");
            cy.get('[data-test="btn-submit-refund"]').click();
    }else{
        cy.origin(Cypress.env('baseUrlCerybro'), () => {
            console.log('manual refund in crybro')
            cy.contains('.nav-link', 'استرداد').click();
            cy.get('[data-name="refundRequestId"]').click();
            cy.get('.tab_heading-title').eq(6).click({force: true});  //4
            cy.contains('button.btn-outline-primary', 'عملیات‌ها').click();
            cy.get('[data-test="submitRefundInfo"]').click();
            cy.wait(10000)
            cy.get('[data-test="penalty"]').eq(0).type("0");
            cy.get('[data-test="penalty"]').eq(1).type("0");
            cy.get('[data-test="btn-submit-refund"]').click();
        })
    }

}

// export function confirmRefundTour(){
//     cy.visit(Cypress.env('baseUrlCerybro') + `/tour/refund-requests`);
//     // cy.origin(Cypress.env('baseUrlCerybro') + `/tour/refund-requests`, () => {
//         loginCerybro();
//     cy.wait('@getRefundTour', {timeout: 240000})
//     cy.contains('عملیات').first().click();
//         cy.contains('ثبت جریمه استرداد').click();
//         cy.get('[data-test="penalty"]').first().type("0" , {force: true});
//         cy.get('[data-test="btn-submit-refund"]').click();
//
//         cy.contains('عملیات').first().click();
//         cy.contains('تایید درخواست استرداد').click();
//         cy.get('[data-test="btn-submit-refund"]').click();
//     // })
//
// }

export function apiRefundTour() {
    cy.intercept({
        method: 'GET',
        url: '/api/v1/tour/packages/refund/?filter=&page_size=25&page_no=1',
        hostname: 'wscp.indraproject.ir'
    }).as('getRefundTour')
}


export function login(platform){
    if(platform === 'b2c')
    cy.get('[data-test="login-register"]').then(async $element => {
        const text = $element.text();
        if (text.includes(' ورود یا ثبت‌نام ')) {
            cy.get('[data-test= "login-register"]').click()
            cy.get('[data-test="login-with-password"]').click()
            loginUserPass('username' , 'password');
            await cy.get('.header__username').should('be.visible');
            await cy.get('.header__username').should('have.text', 'Automation Test');

            // cy.wait('@getToken' , { timeout: 30000 })
        }
    })
    if(platform === 'b2b'){
        loginUserPass('usernameB2b' , 'passwordB2b');
    }
    if(platform === 'mobile'){
        cy.get('[data-test="account"]').click({force: true});
        cy.get('[data-test="login-with-password"]').click({force: true});
        loginUserPass('username' , 'password');
        cy.get('[data-test="home"]').click({force: true});
    }
}

function loginUserPass(user , pass){
    cy.get('[data-test="email-phone"] input').click({force: true}).type(Cypress.env(user))
    cy.get('[data-test="password"] input').click({force: true}).type(Cypress.env(pass))
    cy.get('[data-test="login"]').click()
}


export function apiToken(platform){
    let host;
    if(platform === 'b2b'){
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    cy.intercept({
        method: 'POST',
        url: '/api/v3/account/token',
        hostname: host
    }).as('getToken')
}

export function refundTourApi(){
    cy.request({
        method: 'POST' ,
        url: `https://wscp.indraproject.ir/api/v1/account/token`,
        body:{
            'email': Cypress.env('email-cerybro'),
            'password': Cypress.env('password-cerybro')
        }
    }).then((res) => {
        cy.log('resssssssssssssssssss:',JSON.stringify(res.body))
        let token = res.body.result.access_token;
        cy.log('tok:',token)
        cy.request({
            method: 'GET',
            url: 'https://wscp.indraproject.ir/api/v1/tour/packages/refund/?filter=&page_size=1&page_no=1',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        }).then((res1) => {
            cy.log('reeees:', JSON.stringify(res1.body.result.items[0]));
            let numberTour = res1.body.result.items[0].id;
            cy.request({
                method: 'PUT' ,
                url: `https://wscp.indraproject.ir/api/v1/tour/packages/refund/${numberTour}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization'    : `Bearer ${token}`,
                },
                body:{
                    'penaltyAmount': 0
                }
            }).then((res2) => {

                cy.request({
                    method: 'POST' ,
                    url: `https://wscp.indraproject.ir/api/v1/tour/packages/refund/${numberTour}/confirm`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization'    : `Bearer ${token}`,
                    }
                }).then((res3) => {
                    console.log('refund successfully')
                })
            })
        })
    })
}


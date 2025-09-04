
export function plpSaveDataCard($available, dataTest, element) {
    cy.wrap($available).within(() => {
        cy.get(`[data-test="${dataTest}"]  ${element}`).then(($child) => {
            const temp = $child.text();
            cy.log(temp)
            if (dataTest.includes('item')) {
                dataTest = dataTest.replace('item-', '');
            }
            cy.writeFile(`cypress/fixtures/${dataTest}.json`, { data: temp });
        })
    })
}

// export function plp_save_data_card_place(data) {
//     cy.get(`[data-test="${data}"]`).then(($child) => {
//         const temp = $child.text();
//         cy.log(temp)
//         localStorage.setItem(data, temp)
//         cy.wait(1000);
//         if (data === 'date') {
//             dataPlp.date = localStorage.getItem(data)
//         }
//         if (data === 'count') {
//             dataPlp.count = localStorage.getItem(data)
//         }
//         if (data === 'price-detail') {
//             let regex = /([\d,]+)\s*(\D+)/;
//             let result = regex.exec(temp);
//             localStorage.setItem('price', result[1])
//             dataPlp.price = localStorage.getItem('price')
//         }
//     })
// }




export function newTabAvailableGtour(platform = 'desktop') {
    cy.url().then((url) => {
        const newUrl = url.replace('/plp/Test', '/domestic/asia/pdp/gtTest');
        cy.visit(newUrl);
    });
}

export function apiOrder(vertical, platform) {
    let host;
    if (platform === 'b2b') {
        host = Cypress.env('baseUrlApiB2b')
    }
    else {
        host = Cypress.env('baseUrlApi')
    }
    if (vertical === 'others') {
        cy.intercept({
            method: 'GET',
            url: '/api/v1/coordinator/order/*',
            hostname: host
        }).as('getOrder')
    } else if (vertical === 'insurance') {
        cy.intercept({
            method: 'GET',
            url: '/api/v1/order/insurance/*',
            hostname: host
        }).as('getOrder')
    }

}

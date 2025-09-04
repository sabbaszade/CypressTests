export function checkDataFromFile(dataTest, fileName, element, index) {
  
        cy.readFile(`cypress/fixtures/${fileName}.json`).then((data) => {
            cy.get(`[data-test="${dataTest}"] ${element}`).eq(index).should('contain.text', data.data)
        });
    
}
export function checkDataStatic(dataTest , dataConf , element , index) {
    cy.get(`[data-test="${dataTest}"] ${element}`).eq(index).should('contain.text', dataConf)
}


export function clickButton(dataTest, isForce = false){
    cy.get(`[data-test="${dataTest}"]`).first().click({force: isForce})
}
export function clickButtonPriority(dataTest , index){
    cy.get(`[data-test="${dataTest}"]`).eq(index).click()
}
export function fillField(name, data) {
    cy.get(`[name="${name}"]`).click({force: true}).type(data)
}

export function clearAndFillField(name, data) {
    cy.get(`[name="${name}"]`).click({ force: true }).clear().type(data)
}
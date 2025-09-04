import {commonTestData} from "../../../data/dataTestCommon";

export function selectRefundType(){
    cy.get('a-checkbox__checkbox is-radio').click();
}

export function checkFinalPrice(){
    cy.get('[data-test="last-price"]').should('contain.text', commonTestData.dataPlp.price);
}


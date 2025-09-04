import {checkDataFromFile, clickButton} from "./index";
import placeholder from "cypress/types/lodash/fp/placeholder";


export function paxFillSelectList(type , value) {
    cy.get(`[data-test="${type}"] > .a-input > .a-input__input > .self-stretch`).click()
    cy.get(`[data-value="${value}"] > a > .block`).click({force: true});
}
export function paxFillSelectListMobile(type , value) {
    cy.get(`div[data-test="${type}"] select.a-select__select`).select(value);
}

export function paxFillDate( priority , type , platform) {
    let day;let month;let year;
    if(type === 0){  //shamsi
        year = 1390; month = 10; day = 11;
    }
    else if(type === 1){  //miladi
        year = 2012; month = 1; day = 1;
    }
    else if(type === 2) { //passport
        year = 2028; month = 1; day = 1;
    }

    if(platform === 'mobile'){
        cy.get(`div.is-first select.a-select__select`).eq(priority).select(day);
        cy.get(`div.date-input--month select.a-select__select`).eq(priority).select(month);
        cy.wait(1000);
        cy.get(`div.date-input--year select.a-select__select`).eq(priority).select(`${year}` , {force: true});
    }else{
        cy.get('.is-first > .a-input > .a-input__input > .self-stretch > .a-select__input-icon').eq(priority).click()
        cy.get(`[data-value="${day}"] > a > .block`).click()
        cy.wait(2000);
        cy.get('.date-input--month > .a-input > .a-input__input > .self-stretch > .a-select__input-icon' ).eq(priority).click()
        cy.wait(2000);
        cy.get(`[data-value="${month}"] > a > .block`).click({force: true})
        cy.wait(1000);
        cy.get('.date-input--year > .a-input > .a-input__input > .self-stretch > .a-select__input-icon').eq(priority).click()
        cy.get(`[data-value="${year}"] > a > .block`).click()
    }

}

export function submit(checkPrice , platform){
    console.log('check last price and go to confirm')
    if(checkPrice === 1){
        if(platform === 'mobile'){
            cy.get('[data-test="toggle-price"]').click({force:true});
            checkDataFromFile('price-details' , 'price' , 'strong' , 0);
            checkDataFromFile('total-price' , 'price' , 'strong', 0);
        }else{
            checkDataFromFile('last-price' , 'price' , '',0);
        }
    }
    if(checkPrice === 2){
        checkDataFromFile('price' , 'price' , '',0);
    }
    if(platform=='mobile'){
      cy.get('#bottomStickContainer button.is-lg.is-solid-secondary.is-block.mb-safe').click({force:true})
    }else{
        clickButton('submit',true);
    }
}


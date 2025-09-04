import {
    checkOrder, clickButton,
    continueRefund,
    finalizeTransaction, paymentRefund, refundManual,
    search,
    signIn,
    signInCrybro,
    submit,
    submitRefund
} from "../../general";
import {trainTestData} from "../../../../data/dataTestTrain";
import {
    checkAvailableInfoConfirm,
    checkAvailableInfoPax,
    checkAvailableMyTrips,
    checkPassengerInfo,
    fillPassengerInfo, otherInfoMyTrips,
    selectAvailable
} from "./utils";

export function saleType(platform , isPortal) {
    signIn(platform);
    search('train-tab', trainTestData.dataHomePage.origin, trainTestData.dataHomePage.destination, false , platform , 'train');
    selectAvailable(platform);
    if(platform === 'mobile'){
        cy.wait(2000);
        clickButton('submit');
    }
    cy.wait(5000);
    checkAvailableInfoPax(platform);
    fillPassengerInfo( platform);
    submit(1 , platform);
    checkAvailableInfoConfirm();
    checkPassengerInfo(platform);
    finalizeTransaction(isPortal , 'train-tab');
    checkOrder('بلیط شما با موفقیت صادر شد', true , true  , platform);
    checkAvailableMyTrips();
    continueRefund(0 , false);
    otherInfoMyTrips();
    paymentRefund('');
    // signInCrybro('train' , platform);
    // cy.wait(100000);
    // refundManual(platform);
}
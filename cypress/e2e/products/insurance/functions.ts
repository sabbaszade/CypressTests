import {
    checkOrder,
    clickButton,
    continueRefund,
    finalizeTransaction,
    paymentRefund,
    search,
    signIn,
    submit
} from "../../general";
import {insuranceTestData} from "../../../../data/dataTestInsurance";
import {checkAvailableInfoConfirm, checkAvailableInfoPax, checkAvailableMyTrips, checkPassengerInfo, fillPassengerInfo, otherInfoMyTrips, selectAvailable} from "./utils";

export function saleType(platform , isPortal) {
    signIn(platform);
    search('travel-insurance' , 'noHaving' , insuranceTestData.dataHomePage.destination , 'noHaving' , platform , 'travel-insurance');
    selectAvailable(platform);
    if(platform === 'mobile'){
        cy.wait(2000);
        clickButton('submit');
    }
    checkAvailableInfoPax(platform);
    fillPassengerInfo(platform);
    submit(1 , platform);
    checkAvailableInfoConfirm();
    checkPassengerInfo();
    finalizeTransaction(isPortal , 'travel-insurance');
    checkOrder('بیمه‌نامه شما با موفقیت صادر شد', true , true, platform);
    checkAvailableMyTrips();
    continueRefund(0 , true);
    otherInfoMyTrips();
    paymentRefund('');
}
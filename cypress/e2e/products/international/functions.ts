import {
    checkOrder,
    clickButton,
    continueRefund,
    finalizeTransaction,
    paymentRefund,
    refundManual,
    search,
    signIn,
    signInCrybro,
    signInNightly,
    submit
} from "../../general";
import {internationalTestData} from "../../../../data/dataTestInternational";
import {checkAvailableInfoConfirm, checkAvailableInfoPax, checkAvailableMyTrips, checkPassengerInfo, fillPassengerInfo, otherInfoMyTrips, selectAvailable} from "./utils";

export function saleType(platform , isPortal) {
    signInNightly(platform);
    search('iranout-tab', internationalTestData.dataHomePage.origin, internationalTestData.dataHomePage.destination, false , platform , 'domestic-iranout');
    selectAvailable(platform);
    cy.wait(4000)
    clickButton('submit');
    checkAvailableInfoPax(platform);
    fillPassengerInfo(platform);
    submit(1 , platform);
    checkAvailableInfoConfirm();
    checkPassengerInfo(platform);
    finalizeTransaction(isPortal , 'iranout-tab');
    checkOrder('بلیط شما با موفقیت صادر شد', true , true, platform);
    checkAvailableMyTrips();
    continueRefund(1 , true);
    otherInfoMyTrips();
    paymentRefund('international');
    signInCrybro('international' , platform);
    refundManual(platform);
}
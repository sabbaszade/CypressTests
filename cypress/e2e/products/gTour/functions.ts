import {search, signIn, signInGtour, signInNightly, submit} from "../../general";
import {gTourTestData} from "../../../../data/dataTestGTour";
import {checkAvailableInfoPax, checkPassengerInfo, fillPassengerInfo, selectAvailable, selectTour} from "./utils";

export function saleType(platform , isPortal) {
    signInNightly(platform);
    search('group-tour', 'noHaving', gTourTestData.dataHomePage.destination, 'noHaving' , platform , platform ==='mobile'? 'gtour': '');
    selectAvailable(platform);
    cy.wait(5000);
    selectTour();
    if (platform!=='mobile'){
        checkAvailableInfoPax();
    }
    fillPassengerInfo(platform);
    submit(0 , platform);
    checkPassengerInfo();
    // finalizeTransaction(isPortal);
    // checkOrder('پرداخت با موفقیت انجام شد', false);
    // checkAvailableMyTrips();
    // continueRefund(1);
    // otherInfoMyTrips();
    // paymentRefund();
    // signInCrybro('tour');
    // confirmRefundTour();
}

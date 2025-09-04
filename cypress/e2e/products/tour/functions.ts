import {checkOrder, confirmRefundTour, continueRefund, finalizeTransaction, paymentRefund, search, signIn, submit} from "../../general";
import {tourTestData} from "../../../../data/dataTestTour";
import {checkAvailableInfoConfirm, checkAvailableInfoPax, checkAvailableMyTrips, checkPassengerInfo,fillPassengerInfo, otherInfoMyTrips, selectAvailable, selectRoom} from "./utils";
import {refundTourApi} from "./apiFunctions";

export function saleType(platform , isPortal) {
    signIn(platform);
    search('tour-tab', tourTestData.dataHomePage.origin, tourTestData.dataHomePage.destination, true , platform , 'tour');
    selectAvailable(platform);
    selectRoom();
    cy.wait(5000);
    checkAvailableInfoPax();
    fillPassengerInfo(platform);
    submit(0 , platform);
    checkAvailableInfoConfirm();
    checkPassengerInfo();
    finalizeTransaction(isPortal ,'tour-tab');
    checkOrder('پرداخت با موفقیت انجام شد', true , false, platform);
    checkAvailableMyTrips();
    continueRefund(1 , false);
    otherInfoMyTrips();
    paymentRefund('');
    refundTourApi();
}
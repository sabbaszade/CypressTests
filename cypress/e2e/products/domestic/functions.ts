import {
    checkDataStatic,
    clickOrderDomestic,
    continueRefund,
    finalizeTransaction,
    paymentRefund,
    search,
    signIn,
    submit
} from "../../general";
import {domesticTestData} from "../../../../data/dataTestDomestic";
import {checkAvailableInfoConfirm, checkAvailableInfoPax, checkAvailableMyTrips, checkPassengerInfo, fillPassengerInfo, selectAvailable} from "./utils";
import {commonTestData} from "../../../../data/dataTestCommon";

export function saleType(platform ,isPortal){
    signIn(platform);
    search('domestic-tab', domesticTestData.dataHomePage.origin, domesticTestData.dataHomePage.destination, false  , platform , 'domestic-iranout');
    cy.wait(10000);
    selectAvailable(platform);
    checkAvailableInfoPax(platform);
    fillPassengerInfo(platform);
    submit(1 , platform);
    checkAvailableInfoConfirm();
    checkPassengerInfo(platform);
    finalizeTransaction(isPortal , 'domestic-tab');
    clickOrderDomestic('پرواز شما با موفقیت خریداری شد', true , true , platform );
    checkAvailableMyTrips();
    continueRefund(1 , true);
    checkDataStatic('full-name' , commonTestData.dataPax.nameLatin + ' ' + commonTestData.dataPax.nameLatin,'',0)
    paymentRefund('');
}
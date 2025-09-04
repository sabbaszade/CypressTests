import {checkOrder, continueRefund, finalizeTransaction, paymentRefund, search, signIn, submit} from "../../general";
import {busTestData} from "../../../../data/dataTestBus";
import {checkAvailableInfoConfirm, checkAvailableInfoPax, checkAvailableMyTrips, checkPassengerInfo, fillPassengerInfo, otherInfoMyTrips, selectAvailable} from "./utils";


export function saleType(platform , isPortal){
    signIn(platform);
    search('bus-tab', busTestData.dataHomePage.origin, busTestData.dataHomePage.destination, false, platform, 'bus');
    selectAvailable(platform);
    checkAvailableInfoPax(platform);
    fillPassengerInfo(platform);
    submit(1 , platform);
    checkAvailableInfoConfirm();
    checkPassengerInfo();
    finalizeTransaction(isPortal , 'bus-tab');
    checkOrder('بلیط شما با موفقیت صادر شد', true , true  , platform);
    checkAvailableMyTrips();
    continueRefund(0 , true);
    otherInfoMyTrips();
    paymentRefund('');
}

import {
    checkAvailableInfoPax,
    checkAvailableMyTrips,
    checkInfoPdp,
    fillPassengerInfo,
    otherInfoMyTrips,
    selectAvailable
} from "./utils";
import {
    checkOrder,
    clickButton,
    continueRefund,
    finalizeTransaction,
    paymentRefund,
    search,
    signIn
} from "../../general";
import {version} from "acorn";
import {accommodationTestData} from "../../../../data/dataTestAccommodation";

export function saleType(platform , isPortal) {
    signIn(platform);
    search('accommodation-tab', 'noHaving', accommodationTestData.dataHomePage.destination, true, platform, 'accommodation');
    // selectAvailable();
    checkInfoPdp(platform);
    //cy.visit('https://hydranightly.indraproject.ir/accommodation/pdp/villa-48?checkin=1403-02-23&checkout=1403-02-24&count=1&city=province-mazandaran&keyword=%D8%A7%D8%AC%D8%A7%D8%B1%D9%87+%D9%88%DB%8C%D9%84%D8%A7+%D9%88+%D8%B3%D9%88%D8%A6%DB%8C%D8%AA+%D8%AF%D8%B1+%D9%85%D8%A7%D8%B2%D9%86%D8%AF%D8%B1%D8%A7%D9%86')
    // cy.get('[data-test="reserve"]').click();
    checkAvailableInfoPax(platform);
    fillPassengerInfo();
    clickButton('submit')
    finalizeTransaction(isPortal , 'accommodation-tab');
    checkOrder('واچر شما با موفقیت صادر شد', true , true , platform);
    checkAvailableMyTrips();
    continueRefund(1 , false);
    otherInfoMyTrips();
    paymentRefund('');
}
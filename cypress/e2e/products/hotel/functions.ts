import {
    checkOrder, continueRefund,
    finalizeTransaction, paymentRefund,
    refundManual,
    search,
    signIn,
    signInCrybro,
    submit,
    submitRefund
} from "../../general";
import {
    checkAvailableMyTrips,
    checkPassengerInfo,
    fillPassengerInfo,
    otherInfoMyTrips,
    selectAvailable,
    selectRoom
} from "./utils";
import {hotelTestData} from "../../../../data/dataTestHotel";

export function saleType(platform , isPortal) {
    signIn(platform);
    search('hotel-tab', 'noHaving', hotelTestData.dataHomePage.destination, true , platform , 'hotel');

    // if((platform === 'b2c')||( platform === 'mobile')){
    //     cy.visit(`${Cypress.env('baseUrl')}hotel/search?destination=City_7101534970300072031_یزد&destinationCity=7101534970300072031&cityId=7101534970300072031&countryCode=IR&region=dom&cityEn=Yazd&departing=2024-08-20&returning=2024-08-21&rooms=30`)
    // }
    // if(platform === 'b2b'){
    //     cy.visit(`${Cypress.env('baseUrlB2b')}hotel/search?destination=City_7101534970300072031_یزد&destinationCity=7101534970300072031&cityId=7101534970300072031&countryCode=IR&region=dom&cityEn=Yazd&departing=2024-08-20&returning=2024-08-21&rooms=30`)
    // }
    selectAvailable(platform);
    selectRoom(platform);
    cy.wait(3000);
    fillPassengerInfo(platform);
    submit(2 , platform);
    checkPassengerInfo();
    finalizeTransaction(isPortal , 'hotel-tab');
    checkOrder('واچر شما با موفقیت صادر شد', true , true, platform);
    checkAvailableMyTrips();
    continueRefund(0 , false);
    otherInfoMyTrips();
    paymentRefund('hotel');
    signInCrybro('international-hotel' , platform);
    refundManual(platform);
}
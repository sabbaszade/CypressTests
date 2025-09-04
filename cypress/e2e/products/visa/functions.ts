import {checkAvailableInfoPax, checkPricePax, fillPassengerInfo, pdpPage, searchVisa} from "./utils";
import {signIn} from "../../general";
import {visaTestData} from "../../../../data/dataTestVisa";

export function saleType(platform) {
    signIn(platform);
    searchVisa('visa'  , visaTestData.dataHomePage.destination , platform );
    pdpPage(platform);
    checkAvailableInfoPax();
    fillPassengerInfo(platform);
    checkPricePax();
}
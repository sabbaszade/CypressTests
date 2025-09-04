import {defineConfig} from 'cypress';
import installLogsPrinter from "cypress-terminal-report/src/installLogsPrinter";
import logToOutput from "cypress-log-to-output";

// const logToOutput = require('cypress-log-to-output');
// const installLogsPrinter = require ("cypress-terminal-report/src/installLogsPrinter");

module.exports = defineConfig({
    pageLoadTimeout: 100000,
    redirectionLimit: 100,
    watchForFileChanges: false,
    defaultCommandTimeout: 60000,
    responseTimeout: 60000,
    // chromeWebSecurity:false,

    env: {


        // baseUrl: 'https://www.alibaba.ir',   //prod
        baseUrlStage: 'https://hydranightly.indraproject.ir/',  //stage
        baseUrl: 'http://hydra-front-e2e.k8s.indra.local/',  //prod-frontStage
        // baseUrl: 'https://4262-hydra.dev.indraproject.ir/',

        baseUrlB2b: 'https://seller.indraproject.ir/',


        // baseUrlApi: 'ws.alibaba.ir',   //prod
        baseUrlApi: 'ws.indraproject.ir',  //stage
        baseUrlApiB2b: 'bws.indraproject.ir',

        serviceBaseUrl: 'ebus-service.indraproject.ir',

        // baseUrlCerybro: 'https://cerebro.alibaba.ir',  //prod
        baseUrlCerybro: 'https://cerebro.indraproject.ir',  //stage
        // baseUrlCerybro: 'https://1486-cerebro-indra.dev.projectzii.ir'  //stage
        USER_AGENT: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  
    },
    // hideXHR: true
    e2e: {
        // setupNodeEvents(on,config) {
        //     installLogsPrinter(on, {
        //         printLogsToConsole: "always",
        //     });
        //     logToOutput.install(on);
        //
        // },
        video: true, 
        videoCompression: 32,
        // setupNodeEvents(on, config) {
        //   // implement node event listeners here
        // },
        // set user agent to exclude cypress production traffic in analytics
        // userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
        testIsolation: false,
        experimentalOriginDependencies: true,
        // retries: {
        //     runMode: 3,
        //     openMode: 2,
        // },




    },

    "reporter":
        "mochawesome",
    "reporterOptions":
        {
            "reportDir":
                "cypress/reports/mochawesome",
            "overwrite":
                false,
            "html":
                true,
            "json":
                true
        }
    ,
})
;
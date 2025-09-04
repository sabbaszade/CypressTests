import 'cypress-xpath';
import './commands';
import 'cypress-log-to-output';
import  "cypress-terminal-report/src/installLogsCollector";


import {defineConfig} from "cypress";
// import  './testData'

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
})
// module.exports = defineConfig({
//     e2e: {
//         setupNodeEvents(on) {
//             // on('before:browser:launch', (browser = {
//             //     family: undefined,
//             //     name: undefined
//             // }, launchOptions) => {
//             //     if (browser.family === 'chromium' && browser.name !== 'electron') {
//             //         launchOptions.args.push('--blink-settings=imagesEnabled=false')
//             //         return launchOptions
//             //     }
//             //
//             // })
//         },
//     },
// });
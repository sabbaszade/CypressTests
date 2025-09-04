import {Buffer} from "../../support/commands";


import { readFile } from 'fs/promises'; // Assuming you're using Node.js file system module

// export   function convertImageToBase64(imagePath){
//     return readFile(imagePath, 'binary').then((imageContent) => {
//         const base64Image = Buffer.from(imageContent, 'binary').toString('base64');
//         return base64Image;
//     });
// }


export const solveCaptcha = (src) => {
    const getCaptchaResult = (taskId: string, iteration: number): any => {
        if (iteration >= 5) {
            return
        }
        return cy.request({
            method: 'POST',
            url: 'https://api.anti-captcha.com/getTaskResult',
            body: {
                clientKey: '14e6b60d18085ade8c9983a228f91520',
                taskId: taskId,
            },
        }).then((res) => {
            if (res)
                if (res.body.status === "processing") {
                    getCaptchaResult(taskId, iteration + 1)
                } else {
                    return {
                        then: (callbackFn: any) => callbackFn(res)
                    }
                }
        })

    }

    return new Promise((resolve, reject) => {
        cy.log('START CAPTCHA');
        console.log('src:',src)
        cy.request({
            method: 'POST',
            url: 'https://api.anti-captcha.com/createTask',
            body: {
                clientKey: '14e6b60d18085ade8c9983a228f91520',
                task: {
                    type: 'ImageToTextTask',
                    body: src,
                    phrase: null,
                    case: null,
                    numeric: null,
                    comment: null,
                    math: null,
                    minLength: null,
                    maxLength: null,
                },
                languagePool: null,
                softId: 0,
            },
        }).then(async (response) => {
            cy.wait(2000)
            cy.log('ressssssssssssss3',JSON.stringify(response))
            if (response.body.taskId) {
                let taskId = response.body.taskId;
                console.log('responseeeeeeeee2:', taskId);
                cy.wait(5000)
                getCaptchaResult(taskId, 1).then(res => {
                    console.log('finallll', res);
                    let result = res.body.solution.text;
                    console.log('CAPPPPPTCHAAAA:', result);
                    resolve(result)
                })
            }
        })
        setTimeout(() => {
            reject(null)
        }, 50000)
    })


};
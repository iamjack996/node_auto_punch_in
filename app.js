require('dotenv').config()
const puppeteer = require("puppeteer")
const { createWorker } = require('tesseract.js')
const worker = createWorker()

const url = 'https://www.bck6688.com/login'
// const url = 'https://www-bck.bckplat.info/login'

const loginInfo = {
    account: process.env.account,
    password: process.env.password
}

console.log(loginInfo)

// let base64 = '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'

// let imageBuffer = Buffer.from(base64, "base64")

const getNumberByBase64Img = async (base64) => {
    let imageBuffer = await Buffer.from(base64, "base64")
    await worker.load();
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
    })
    const { data: { text } } = await worker.recognize(imageBuffer)

    await worker.terminate()
    return text
}

// return
const openPage = async () => {
    const browser = await puppeteer.launch({
        channel: 'chrome',
        headless: false, // 背景運行
        defaultViewport: null, // 设置页面视口大小，默认800*600，如果为null的话就禁用视图口
        args: ['--start-maximized'], // 最大化视窗
        ignoreDefaultArgs: ['--enable-automation'], // 禁止展示chrome左上角有个Chrome正受自动软件控制，避免puppeteer被前端JS检测到
        devtools: true, // F12瀏覽器檢查
    }) // 
    const page = await browser.newPage()

    await page.goto(url)

    // Page Title
    // const result = await page.evaluate(() => {
    //     return document.title
    // })
    // console.log(result)
    return page
}

const unlockPasswordInput = async (page) => {
    return await new Promise(async (resolve, reject) => {
        await page.waitForSelector('.hg-button-controlleft')
            .then(async () => {
                console.log(1.5)
                setTimeout(async () => {
                    console.log(2)
                    await page.click('.hg-button-controlleft')
                    resolve(true)
                }, 800)
            })
    })
}

const getValidateNumber = async (base64Str) => {
    return await new Promise(async (resolve, reject) => {
        valiNumber = await getNumberByBase64Img(base64Str.split('data:image/png;base64,')[1])
        console.log('>>>', valiNumber.toString(), 'len:', valiNumber.toString().length)

        resolve(valiNumber)
    })
}

// return
openPage().then(async (page) => {

    // debugger;

    setTimeout(async () => {

        await page.waitForSelector('.el-input__inner')
            .then(async () => {

                const inputPassword = await page.$('input[type=password].el-input__inner')

                await inputPassword.click() // input[type=password].el-input__inner  input
                console.log(1)
                await unlockPasswordInput(page)
                    .then(async () => {
                        console.log(3)
                        const inputAccount = await page.$('.el-input__inner')
                        await inputAccount.type(loginInfo.account)
                        const realInsidePwInput = await page.$('input[type=password].input')
                        await realInsidePwInput.type(loginInfo.password)
                    }).then(async () => {
                        console.log(4)
                        await (await page.$('.hg-button-enter')).click()
                    }).then(async () => {
                        console.log(5)
                        const validateImage = await page.$('img')
                        const src = await validateImage.getProperty('src')
                        let base64Str = src._remoteObject.value

                        let valiNumber = await getValidateNumber(base64Str)
                        console.log(6)

                        const numberInput = await page.$('input[type=number].el-input__inner')
                        await numberInput.type(valiNumber)

                        return !!(valiNumber.toString().length == 5)
                    }).then(async (toClick) => {
                        console.log('click :', toClick)
                        if (toClick) {
                            // await page.waitForSelector('button[type=button].login-button')
                            //     .then(async () => {
                            //         console.log(7)
                            //         await (await page.$('button[type=button].login-button')).click()
                            //     })
                        }
                        console.log(8)
                        return toClick
                    }).then(async (toClick) => {
                        console.log(9)
                        if (toClick) {
                            await page.waitForSelector('#punch_in')
                                .then(async () => {
                                    console.log(10)
                                    // 上班打卡
                                    await (await page.$('#punch_in')).click()
                                })
                                .catch(e => {
                                    console.log(e)
                                })
                        }
                    })


            })

    }, 1200)

})

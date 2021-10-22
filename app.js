require('dotenv').config()
const puppeteer = require("puppeteer")
const { createWorker } = require('tesseract.js')
const worker = createWorker()

const url = 'https://www.bck6688.com/login'

const loginInfo = {
    account: process.env.account,
    password: process.env.password
}

const getNumberByBase64Img = async (base64, init) => {
    let imageBuffer = await Buffer.from(base64, "base64")

    if (init) {
        await worker.load()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')
        await worker.setParameters({
            tessedit_char_whitelist: '0123456789',
        })
    }

    const { data: { text } } = await worker.recognize(imageBuffer)

    // if (!init) await worker.terminate()
    return text
}

const openPage = async () => {
    const browser = await puppeteer.launch({
        channel: 'chrome',
        headless: false, // 背景運行
        defaultViewport: null, // 设置页面视口大小，默认800*600，如果为null的话就禁用视图口
        args: ['--start-maximized'], // 最大化视窗
        ignoreDefaultArgs: ['--enable-automation'], // 禁止展示chrome左上角有个Chrome正受自动软件控制，避免puppeteer被前端JS检测到
        devtools: true, // F12瀏覽器檢查
    })
    const page = await browser.newPage()

    await page.goto(url)

    page.once('load', () => console.log('Page loaded!'))

    page.on('console', async err => {

        if (err.type() === 'error') {
            console.log(err)
            if (err.location().url == 'https://pub.bck6688.com/api/login') {
                console.log('Retry input number')
                await (await page.$('.el-message-box__headerbtn')).click()

                setTimeout(async () => {
                    let valiNumber = await fillByValidatorNumberImage(page, true)
                    await afterValidateNumber(page, valiNumber)
                }, 2000)
            }
        }
    })

    return page
}

const unlockPasswordInput = async (page) => {
    return await new Promise(async (resolve, reject) => {
        const lockBtnClass = '.hg-button-controlleft'
        await page.waitForSelector(lockBtnClass)
            .then(async () => {
                // setTimeout(async () => {
                await page.click(lockBtnClass)
                resolve(true)
                // }, 500)
            })
    })
}

const getValidateNumber = async (base64Str, secondExec) => {
    return await new Promise(async (resolve, reject) => {
        resolve(await getNumberByBase64Img(base64Str.split('data:image/png;base64,')[1], !secondExec))
    })
}

const fillByValidatorNumberImage = async (page, secondExec = false) => {
    return await new Promise(async (resolve, reject) => {
        // validator number image
        const validateImage = await page.$('img')
        // update validator image after first time
        if (secondExec) await validateImage.click()

        setTimeout(async () => {
            const src = await validateImage.getProperty('src')
            let imgSrcValue = src._remoteObject.value

            let valiNumber = await getValidateNumber(imgSrcValue, secondExec)
            if (valiNumber.toString().length < 5) valiNumber = '9999'

            const numberInput = await page.$('input[type=number].el-input__inner')
            await numberInput.type(valiNumber)

            resolve(valiNumber)
        }, 800)
    })
}

const toClickPunchIn = async (page, valiNumber) => {
    return await new Promise(async (resolve, reject) => {
        if (valiNumber === '9999') {
            await page.waitForSelector('button[type=button].login-button')
                .then(async () => {
                    await (await page.$('button[type=button].login-button')).click()
                    resolve(false)
                })
        } else {
            resolve(true)
        }
    })
}

const afterValidateNumber = async (page, valiNumber) => {
    if (await toClickPunchIn(page, valiNumber)) {
        await page.waitForSelector('#punch_in')
            .then(async () => {
                // click 上班打卡
                await (await page.$('#punch_in')).click()
            })
            .catch(e => {
                console.log(e)
            })
    }
}

// return
openPage().then(async (page) => {
    // debugger;
    setTimeout(async () => {
        await page.waitForSelector('input[type=password].el-input__inner') // .el-input__inner
            .then(async () => {

                const inputPassword = await page.$('input[type=password].el-input__inner')
                await inputPassword.click()

                await unlockPasswordInput(page)
                    .then(async () => {
                        const inputAccount = await page.$('.el-input__inner')
                        await inputAccount.type(loginInfo.account)
                        const realInsidePwInput = await page.$('input[type=password].input')
                        await realInsidePwInput.type(loginInfo.password)
                    })
                    .then(async () => {
                        await (await page.$('.hg-button-enter')).click()
                    })
                    .then(async () => {
                        // 開始驗證圖片數字
                        let valiNumber = await fillByValidatorNumberImage(page)
                        await afterValidateNumber(page, valiNumber)
                    })
            })
    }, 1200)

})

require('dotenv').config()
const puppeteer = require("puppeteer")
const { createWorker } = require('tesseract.js')
const worker = createWorker()

// const url = 'https://www.bck6688.com/login'
const url = 'https://www-bck.bckplat.info/login'

const loginInfo = {
    account: process.env.account,
    password: process.env.password
}

console.log(loginInfo)

// 測試解析圖片
// let imageUrl = __dirname + "/image/6153.png"
// async function getTextFromImage() {
//     await worker.load()
//     await worker.loadLanguage('eng')
//     await worker.initialize('eng')

//     const { data: { text } } = await worker.recognize(imageUrl)
//     await worker.terminate()
//     return text
// }
// getTextFromImage()
//     .then(console.log)

// endtest

const openPage = async () => {
    const browser = await puppeteer.launch({
        channel: 'chrome',
        headless: false, // 背景運行
        defaultViewport: null, // 设置页面视口大小，默认800*600，如果为null的话就禁用视图口
        args: ['--start-maximized'], // 最大化视窗
        ignoreDefaultArgs: ['--enable-automation'], // 禁止展示chrome左上角有个Chrome正受自动软件控制，避免puppeteer被前端JS检测到
        // devtools: true, // F12瀏覽器檢查
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
                await page.click('.hg-button-controlleft')
                console.log(2)
                resolve(true)
            })
    })

}

openPage().then(async (page) => {

    // debugger;

    const inputAccount = await page.$('.el-input__inner') // 定位输入框元素
    const inputPassword = await page.$('input[type=password].el-input__inner')

    await inputAccount.type(loginInfo.account)

    await inputPassword.click() // input[type=password].el-input__inner  input
    console.log(1)
    await unlockPasswordInput(page).then(async () => {
        await inputPassword.type(loginInfo.password)
        console.log(3)
    }).then(async () => {
        console.log(4)
        const realInsidePwInput = await page.$('input[type=password].input')
        await realInsidePwInput.type(loginInfo.password)
    }).then(async () => {
        console.log(5)
        setTimeout(async () => {
            await (await page.$('.hg-button-enter')).click()
        }, 1000)
    })

    console.log(6)
    return page
}).then(async (page) => {


    console.log(7)
    await page.waitForSelector('#punch_in')
        .then(async () => {
            // 上班打卡
            console.log(8)
            // await (await page.$('#punch_in')).click()
        })
        .catch(e => {
            console.log(e)
        })


})
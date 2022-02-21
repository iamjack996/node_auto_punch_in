require('dotenv').config()
const axios = require('axios')
const config = require('./config')
const prompts = require('prompts')
const child_process = require('child_process')
const appSite = process.env.app_site
const { account, password } = process.env

let toDo

const execCommand = (cmd) => {
    child_process.exec(cmd, function (error, stdout, stderr) {
        if (error) console.log(error)
    })
}

const askWhatToDo = async () => {
    const response = await prompts(config.initQuestions)
    switch (response.action) {
        case 1:
            toDo = 'punchIn'
            execCommand('msg %username% /time:10 "執行打卡上班"')
            console.log('執行打卡上班')
            break
        case 2:
            toDo = 'punchOut'
            execCommand('msg %username% /time:10 "執行打卡下班"')
            console.log('執行打卡下班')
            break
        default:
            toDo = 'nothing'
            console.log('已確認不動作')
    }
}

const login = async () => {
    console.log(appSite === 'master' ? '正式站打卡' : '測試站打卡')

    return new Promise(async (resolve, reject) => {

        let loginData = {
            employee: account,
            password
        }

        if (appSite === 'master') {
            loginData = {
                ...loginData,
                captcha: '5720',
                key: '$2y$10$ZNQzIIiWpyuBoeSLnTFKS.GWNSCAcjhCfQHuYP.fuuIT4qHvT99la'
            }
        }

        axios
            .post(config.url[appSite].loginPostForApi, loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                // console.log(`statusCode: ${res.status}`)
                // console.log(res.data)

                if (res.status == 200) console.log('登入成功')
                resolve(res.data.data.apiToken)
            })
            .catch(error => {
                console.error(error)
            })
    })
}

const init = async () => {
    await askWhatToDo().then(async () => {

        if (toDo === 'nothing') return

        let token = await login()

        let headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        // console.log('打卡')
        // console.log(headers)
        // console.log(config.url[appSite].punch + (toDo == 'punchIn' ? '0' : '1'))

        axios
            .post(config.url[appSite].punch + (toDo == 'punchIn' ? '0' : '1'), { account, password }, {
                headers
            })
            .then(res => {
                // console.log(`statusCode: ${res.status}`)

                if (res.status == 200) console.log('打卡成功')
                // console.log(res.data)
            })
            .catch(error => {
                console.error(error)
            })
    })
}

init()



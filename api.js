require('dotenv').config()
const axios = require('axios')
const config = require('./config')
const appSite = process.env.app_site
const { account, password, login_captcha, login_key } = process.env
const helper = require('./helper')

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
                captcha: login_captcha,
                key: login_key
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
    await helper.askWhatToDo().then(async (toDo) => {

        if (toDo === 'nothing') return

        let token = await login()
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

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
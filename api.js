require('dotenv').config()
const axios = require('axios')
const config = require('./config')
const prompts = require('prompts')
const child_process = require('child_process')
const appSite = process.env.app_site
const { account, password } = process.env

let toDo

// 打卡 https://pub-bck.bckplat.info/api/punchCard/0  => 0上班 config.punch+0 , 1下班 config.punch+1

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
    console.log(account, password)
    axios
        .post(config.url[appSite].loginPostForApi, { account, password }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            console.log(`statusCode: ${res.status}`)
            console.log(res.data)
        })
        .catch(error => {
            console.error(error)
        })
}

const init = async () => {
    await askWhatToDo().then(async () => {

        await login()
        return

        token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vcHViLmJjay5iY2twbGF0LmluZm8vYXBpL2xvZ2luIiwiaWF0IjoxNjQ1MDkzMDMzLCJleHAiOjE2NDUxMjkwMzMsIm5iZiI6MTY0NTA5MzAzMywianRpIjoibHVEMDF1VFFTT1BDenVvWiIsInN1YiI6MTAyNDQyLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIiwiaWQiOjEwMjQ0MiwidXVpZCI6ImM2OTllNjYwLThmZGEtMTFlYy05YjlkLTQ5NGRiYTE1MjUyZSIsImVtcGxveWVlIjoiMjAyMTA1MDUiLCJjb21wYW55Q29kZSI6ImJjayIsImlkQ29tcGFueSI6MSwiaWREZXBhcnRtZW50Ijo4LCJsZXZlbCI6MTAsIm5pY2tOYW1lIjoiU2luIiwiaXAiOiIxOTIuMTY4LjIwLjI1NCJ9.l4mzoXfbzDdk-7VyfXxX6SlfKcUdkSW3aq8-US7S684'

        let headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        console.log(headers)
        console.log(config.url[appSite].punch + (toDo == 'punchIn' ? '0' : '1'))

        axios
            .post(config.url[appSite].punch + (toDo == 'punchIn' ? '0' : '1'), { account, password }, {
                headers
            })
            .then(res => {
                console.log(`statusCode: ${res.status}`)
                console.log(res.data)
            })
            .catch(error => {
                console.error(error)
            })


    })
}

init()



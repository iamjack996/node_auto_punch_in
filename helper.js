const config = require('./config')
const prompts = require('prompts')
const child_process = require('child_process')

const execCommand = (cmd) => {
    child_process.exec(cmd, function (error, stdout, stderr) {
        if (error) console.log(error)
    })
}

exports.askWhatToDo = async () => {
    const response = await prompts(config.initQuestions)
    switch (response.action) {
        case 1:
            execCommand('msg %username% /time:10 "執行打卡上班"')
            console.log('執行打卡上班')
            return 'punchIn'
            break
        case 2:
            execCommand('msg %username% /time:10 "執行打卡下班"')
            console.log('執行打卡下班')
            return 'punchOut'
            break
        default:
            console.log('已確認不動作')
            return 'nothing'
    }
}
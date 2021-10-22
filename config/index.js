
module.exports = {
    url: {
        login: 'https://www.bck6688.com/login',
        loginPost: 'https://pub.bck6688.com/api/login'
    },
    loginInfo: {
        account: process.env.account,
        password: process.env.password
    },
    initQuestions: [
        {
            type: 'number',
            name: 'action',
            message: '請選擇想執行的動作 \n1: 打上班卡 \n2: 打下班卡 \n3: 不動作 \n'
        },
        {
            type: prev => prev == 3 ? 'text' : null,
            name: 'check',
            message: '確定不執行動作嗎? \n y/n'
        },
        {
            type: prev => prev == 'n' ? 'number' : null,
            name: 'action',
            message: '請選擇想執行的動作 \n1: 打上班卡 \n2: 打下班卡 \n3: 不動作 \n'
        }
    ],

}

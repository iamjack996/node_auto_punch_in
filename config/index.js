
module.exports = {
    url: {
        master: {
            login: 'https://www.bck6688.com/login',
            loginPost: 'https://pub.bck6688.com/api/login'
        },
        testing: {
            login: 'https://www-bck.bckplat.info/login',
            loginPost: 'https://www-bck.bckplat.info/api/login',
            loginPostForApi: 'http://pub.bck.bckplat.info/api/login',
            punch: 'http://pub.bck.bckplat.info/api/punchCard/' // 0:上班, 1:下班
        },

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

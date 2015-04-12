module.exports = {
    web: {
        port: 8080     
    },

    database: function () {
        if (process.env['TEST'] === undefined)
            return {
                database: '',
                user:     '',
                password: '',
                host:     '',
                multipleStatements: true
            }
        else
            return {
                database: 'test_littlist',
                user: 'travis',
                password: '',
                host: 'localhost',
                multipleStatements: true
            }
    },
    
    crawlers: {
        useragent: 'LittList v1.0'
    },

    logger: {
        pushbullet: {
            apiKey:  '',
            title:   'LittList.no',
            devices: '',
        }
    }
}

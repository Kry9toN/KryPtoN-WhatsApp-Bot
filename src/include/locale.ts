export {}
const i18n = require('i18n')
const path = require('path')

i18n.configure({
    locales: ['en'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
    objectNotation: true,
    register: global,

    logWarnFn: function (msg: string) {
        console.log('warn', msg)
    },

    logErrorFn: function (msg: string) {
        console.log('error', msg)
    },

    missingKeyFn: function (locale: string, value: string) {
        return value
    },

    mustacheConfig: {
        tags: ['{{', '}}'],
        disable: false
    }
})

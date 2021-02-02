export {}
const i18n = require('i18n')
const path = require('path')

i18n.configure({
    locales: ['en', 'id'],
    directory: path.join(__dirname, '../../locales'),
    defaultLocale: 'en',
    objectNotation: true,
    register: global,

    logWarnFn: function (msg: string) {
        console.log('[INFO]', msg)
    },

    logErrorFn: function (msg: string) {
        console.log('[INFO]', msg)
    },

    missingKeyFn: function (locale: string, value: string) {
        return value
    },

    mustacheConfig: {
        tags: ['{{', '}}'],
        disable: false
    }
})

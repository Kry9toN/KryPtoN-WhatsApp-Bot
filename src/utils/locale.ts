const { dbLocale } = require('./db')

module.exports = async (i18n: any, id: string) => {
    await dbLocale(id).then((locale: string) => {
        i18n.setLocale(locale)
    })
}

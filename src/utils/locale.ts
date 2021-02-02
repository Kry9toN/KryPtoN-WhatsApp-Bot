const { dbLocale } = require('./db')

module.exports = async (i18n: any, id: string) => {
    const LOCALE = await dbLocale(id)
    console.log(LOCALE)
    i18n.setLocale(LOCALE)
}

export {}
const i18n = require('i18n')

module.exports = {
    name: 'demote',
    aliases: ['dm'],
    cooldown: 10,
    description: 'demote.desc',
    execute (client: any, chat: any, pesan: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        if (chat.message.extendedTextMessage === undefined || chat.message.extendedTextMessage === null) return client.reply('Tag target yang ingin di demote!')
        const mentions = client.quotedId || client.mentioned
        let mentioned
        if (!Array.isArray(mentions)) {
            mentioned = []
            mentioned.push(mentions)
        } else {
            mentioned = mentions
        }
        if (mentioned.includes(client.botNumber)) return client.reply(i18n.__('demote.demoteSelf'))
        if (mentioned.length > 1) {
            let teks = i18n.__('demote.demoteBulk')
            for (const _ of mentioned) {
                teks += `@${_.split('@')[0]}\n`
            }
            client.mentions(teks, mentioned, true)
            client.groupDemoteAdmin(client.from, mentioned)
        } else {
            client.mentions(i18n.__('demote.demoted', { user: mentioned[0].split('@')[0] }), mentioned, true)
            client.groupDemoteAdmin(client.from, mentioned)
        }
    }
}

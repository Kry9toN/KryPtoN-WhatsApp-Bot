export {}
const { MessageType } = require('@adiwajshing/baileys')
const i18n = require('i18n')

module.exports = {
    name: 'fakereply',
    aliases: ['fr', 'fake', 'fitnah'],
    cooldown: 35,
    description: 'fakeReply.desc',
    execute (client: any, chat: any, pesan: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        const arg = client.body.slice(9)
        const targets = arg.split('|')[1]
        const bot = arg.split('|')[2]
        if (targets == 'undefined' || bot == 'undefined') return client.reply(i18n.__('fakeReply.error'))
        const mentioned = chat.message.extendedTextMessage.contextInfo.mentionedJid
        client.sendMessage(client.from, `${bot}`, MessageType.text, { quoted: { key: { fromMe: false, participant: `${mentioned}`, ...(client.from ? { remoteJid: client.from } : {}) }, message: { conversation: `${targets}` } } })
    }
}

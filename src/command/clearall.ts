export {}
const i18n = require('i18n')

module.exports = {
    name: 'clearall',
    aliases: ['ca'],
    description: 'clearall.desc',
    execute (client: any, chat: any, pesan: any) {
        if (!client.isOwner) return client.reply(pesan.hanya.owner)
        const chatAll = client.chats.all()
        client.setMaxListeners(25)
        for (const chat of chatAll) {
            client.deleteChat(chat.jid)
        }
        client.reply(i18n.__('clearall.clearDone'))
    }
}

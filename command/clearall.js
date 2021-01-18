const { MessageType } = require('@adiwajshing/baileys')

module.exports = {
    name: 'clearall',
    aliases: ['ca'],
    description: 'Untuk benghapus semua chat _only owner_',
    execute (client, chat, pesan) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!isOwner) return reply('Kamu siapa?')
        chatAll = client.chats.all()
        client.setMaxListeners(25)
        for (let chat of chatAll) {
           client.deleteChat(chat.jid)
        }
        client.reply('Berhasil menghapus semua chat')
    }
}

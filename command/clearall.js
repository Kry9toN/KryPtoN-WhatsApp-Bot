module.exports = {
    name: 'clearall',
    aliases: ['ca'],
    description: 'Untuk benghapus semua chat _only owner_',
    execute (client, chat, pesan) {
        if (!isOwner) return reply('Kamu siapa?')
        chatAll = client.chats.all()
        client.setMaxListeners(25)
        for (const chat of chatAll) {
            client.deleteChat(chat.jid)
        }
        client.reply('Berhasil menghapus semua chat')
    }
}

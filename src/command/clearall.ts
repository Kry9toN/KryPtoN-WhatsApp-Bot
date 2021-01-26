module.exports = {
    name: 'clearall',
    aliases: ['ca'],
    description: 'Untuk benghapus semua chat _only owner_',
    execute (client: any, chat: any, pesan: any) {
        if (!client.isOwner) return client.reply('Kamu siapa?')
        const chatAll = client.chats.all()
        client.setMaxListeners(25)
        for (const chat of chatAll) {
            client.deleteChat(chat.jid)
        }
        client.reply('Berhasil menghapus semua chat')
    }
}

module.exports = {
    name: 'kick',
    aliases: ['k'],
    cooldown: 10,
    description: 'Untuk mengeluarkan angota di group\nPenggunaan: !kick _tag_',
    execute (client, chat, pesan) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        if (chat.message.extendedTextMessage === undefined || chat.message.extendedTextMessage === null) return client.reply('Tag target yang ingin di tendang!')
        const mentioned = chat.message.extendedTextMessage.contextInfo.mentionedJid
        if (mentioned.length > 1) {
            let teks = 'Perintah di terima, mengeluarkan :\n'
            for (const _ of mentioned) {
                teks += `@${_.split('@')[0]}\n`
            }
            client.mentions(teks, mentioned, true)
            client.groupRemove(client.from, mentioned)
        } else {
            client.mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
            client.groupRemove(client.from, mentioned)
        }
    }
}

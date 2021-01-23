module.exports = {
    name: 'promote',
    aliases: ['pm'],
    description: 'Untuk manjadikan admin anggota di group\nPenggunaan: !promote _tag_',
    execute (client, chat, pesan) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        if (chat.message.extendedTextMessage === undefined || chat.message.extendedTextMessage === null) return client.reply('Tag target yang ingin di promote!')
        const mentioned = chat.message.extendedTextMessage.contextInfo.mentionedJid
        if (mentioned.length > 1) {
            let teks = 'Perintah di terima, promote :\n'
            for (const _ of mentioned) {
                teks += `@${_.split('@')[0]}\n`
            }
            client.mentions(teks, mentioned, true)
            client.groupMakeAdmin(client.from, mentioned)
        } else {
            client.mentions(`Perintah di terima, menjadikan admin : @${mentioned[0].split('@')[0]} di group`, mentioned, true)
            client.groupMakeAdmin(client.from, mentioned)
        }
    }
}

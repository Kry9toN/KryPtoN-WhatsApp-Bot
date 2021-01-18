const { MessageType } = require('@adiwajshing/baileys')

module.exports = {
    name: 'demote',
    aliases: ['dm'],
    description: 'Untuk manghapus admin anggota group\nPenggunaan: !demote _tag_',
    execute (client, chat, pesan) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        if (chat.message.extendedTextMessage === undefined || chat.message.extendedTextMessage === null) return client.reply('Tag target yang ingin di tendang!')
        mentioned = chat.message.extendedTextMessage.contextInfo.mentionedJid
        if (mentioned.length > 1) {
            teks = 'Perintah di terima, demote :\n'
            for (let _ of mentioned) {
                teks += `@${_.split('@')[0]}\n`
            }
            client.mentions(teks, mentioned, true)
            client.groupDemoteAdmin(client.from, mentioned)
        } else {
            client.mentions(`Perintah di terima, menghapus admin : @${mentioned[0].split('@')[0]} di group`, mentioned, true)
            client.groupDemoteAdmin(client.from, mentioned)
        }
    }
}

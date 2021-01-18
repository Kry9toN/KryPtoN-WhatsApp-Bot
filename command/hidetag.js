const { MessageType } = require('@adiwajshing/baileys')

module.exports = {
    name: 'hidetag',
    aliases: ['ht'],
    description: 'Untuk mengetag semua orang tanpa @\nPenggunaan !hidetag _text_',
    execute (client, chat, pesan) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        const value = client.body.slice(9)
        const group = client.groupMetadata(client.from)
        const memberList = []
        for (let member of client.groupMembers) {
            memberList.push(member.jid)
        }
        const options = {
            text: value,
            contextInfo: { mentionedJid: memberList },
            quoted: chat
        }
        client.sendMess(client.from, options)
    }
}

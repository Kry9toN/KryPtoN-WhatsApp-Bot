module.exports = {
    name: 'hidetag',
    aliases: ['ht'],
    cooldown: 45,
    description: 'Untuk mengetag semua orang tanpa @\nPenggunaan !hidetag _text_',
    execute (client: any, chat: any, pesan: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        const value = client.body.slice(9)
        const memberList = []
        for (const member of client.groupMembers) {
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

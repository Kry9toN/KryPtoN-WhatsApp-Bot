module.exports = {
    name: 'report',
    cooldown: 10,
    description: 'Untuk mereport user\nPenggunaan: _reply_ !report <alasan>',
    async execute (client: any, chat: any, pesan: any, args: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        const memberList = await client.groupAdmins
        memberList.push(client.sender)
        if (args > 0) {
            const options = {
                text: `Report @${client.sender.split('@')[0]} terkirim ke admin\nAlasan: ${client.body.slice(8)}`,
                contextInfo: { mentionedJid: memberList },
                quoted: chat
            }
            client.sendMess(client.from, options)
        } else {
            const options = {
                text: `Report @${client.sender.split('@')[0]} terkirim ke admin\nAlasan: tidak ada alasan`,
                contextInfo: { mentionedJid: memberList },
                quoted: chat
            }
            client.sendMess(client.from, options)
        }
    }
}

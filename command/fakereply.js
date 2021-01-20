const { MessageType } = require('@adiwajshing/baileys')

module.exports = {
    name: 'fakereply',
    aliases: ['fr', 'fake', 'fitnah'],
    description: 'Untuk memfitnah atau menjahili teman\nPenggunaan !fakereply _tag_',
    execute (client, chat, pesan) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        const arg = client.body.slice(9)
        const targets = arg.split('|')[1]
        const bot = arg.split('|')[2]
        mentioned = chat.message.extendedTextMessage.contextInfo.mentionedJid
        client.sendMessage(client.from, `${bot}`, MessageType.text, { quoted: { key: { fromMe: false, participant: `${mentioned}`, ...(client.from ? { remoteJid: client.from } : {}) }, message: { conversation: `${targets}` } } })
    }
}

/* eslint-disable no-mixed-operators */
export {}
const { MessageType } = require('@adiwajshing/baileys')

module.exports = {
    name: 'siaran',
    description: 'Untuk mengelola member premium group _only owner_',
    async execute (client: any, chat: any, pesan: any, args: any) {
        if (!client.isOwner && !client.isSudo) return client.reply(pesan.hanya.owner)
        if (args.length < 1) return client.reply('Ra onok tulisan')
        const chatAll = await client.chats.all()
        if (client.isMedia && !chat.message.videoMessage || client.isQuotedImage) {
            const encmedia = client.isQuotedImage ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const buff = await client.downloadMediaMessage(encmedia)
            for (const _ of chatAll) {
                client.sendMessage(_.jid, buff, MessageType.image, { caption: `❮ *KryPtoN Bot Broadcast* ❯\n\n${client.body.slice(7)}` })
            }
            client.reply('Berhasil mengirim siaran')
        } else {
            for (const _ of chatAll) {
                client.sendMess(_.jid, `❮ *KryPtoN Bot Broadcast* ❯\n\n${client.body.slice(7)}`)
            }
            client.reply('*Berhasil mengirim siaran*')
        }
    }
}

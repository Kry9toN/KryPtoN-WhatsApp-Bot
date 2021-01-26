export {}
const { MessageType } = require('@adiwajshing/baileys')
const { getBuffer } = require('../utils/functions')

module.exports = {
    name: 'nulis2',
    aliases: ['n2'],
    cooldown: 50,
    description: 'Untuk menuliskan di buku bot\nPenggunaan !nulis2 _tulisan_',
    execute (client: any, chat: any, pesan: any, args: any) {
        const value = args.slice().join(' ')
        getBuffer(`https://api.zeks.xyz/api/nulis?text=${value}&apikey=administrator`)
            .then((hasil: any) => {
                client.reply(pesan.tunggu)
                client.sendMessage(client.from, hasil, MessageType.image, { quoted: chat, caption: pesan.berhasil })
            }).catch((err: string) => {
                console.log(err)
                client.log(err)
            })
    }
}

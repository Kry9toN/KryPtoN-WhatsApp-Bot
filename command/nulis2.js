const { MessageType } = require('@adiwajshing/baileys')
const { getBuffer } = require('../utils/functions')

module.exports = {
    name: 'nulis2',
    aliases: ['n2'],
    description: 'Untuk menuliskan di buku bot\nPenggunaan !nulis _tulisan_',
    execute (client, chat, pesan, args) {
        const value = args.slice().join(' ')
        getBuffer(`https://api.zeks.xyz/api/nulis?text=${value}&apikey=administrator`)
            .then((hasil) => {
                client.reply(pesan.tunggu)
                client.sendMessage(client.from, hasil, MessageType.image, { quoted: chat, caption: pesan.berhasil })
            }).catch((err) => console.log(err))
    }
}

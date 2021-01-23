export {}
const { MessageType } = require('@adiwajshing/baileys')
const { getBuffer } = require('../utils/functions')
const { fetchJson } = require('../utils/fetcher')

module.exports = {
    name: 'nulis3',
    aliases: ['n3'],
    cooldown: 50,
    description: 'Untuk menuliskan di buku bot\nPenggunaan !nulis3 _tulisan_',
    execute (client, chat, pesan, args) {
        const value = args.slice().join(' ')
        fetchJson(`https://tools.zone-xsec.com/api/nulis.php?q=${value}`)
            .then(async (hasil) => {
                client.reply(pesan.tunggu)
                const image = await getBuffer(hasil.image)
                client.sendMessage(client.from, image, MessageType.image, { quoted: chat, caption: pesan.berhasil })
            }).catch((err) => {
                console.log(err)
                client.log(err)
            })
    }
}

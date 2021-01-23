export {}
const { databaseView, databaseInput } = require('../utils/db')

module.exports = {
    name: 'gmium',
    aliases: ['gm'],
    description: 'Untuk mengelola member premium group _only owner_',
    async execute (client, chat, pesan, args) {
        if (!client.isOwner && !client.isSudo) return client.reply(pesan.hanya.owner)
        const gid = args[1]
        if (args[0] === 'add') {
            const mentioned = chat.message.extendedTextMessage.contextInfo.mentionedJid
            const sign = mentioned[0]
            if (args[1] === 'unlimited') {
                if (chat.message.extendedTextMessage === undefined || chat.message.extendedTextMessage === null) return client.reply('Tag yang bersangkutan!')
                const gid = args[2]
                databaseInput(`INSERT INTO gmium(gid, lifetime, signature) VALUES('${gid}', 'unlimited', '${sign}')`)
                    .then(() => {
                        client.reply(pesan.berhasil)
                    }).catch((err) => {
                        client.reply(pesan.gagal)
                        console.log(err)
                    })
            } else {
                databaseInput(`INSERT INTO gmium(gid, lifetime, signature) VALUES('${gid}', 'standard', '${sign}')`)
                    .then(() => {
                        client.reply(pesan.berhasil)
                    }).catch((err) => {
                        client.reply(pesan.gagal)
                        console.log(err)
                    })
            }
        } else if (args[0] === 'del') {
            databaseInput(`DELETE FROM gmium WHERE gid = '${gid}'`)
                .then(() => {
                    client.reply(pesan.berhasil)
                }).catch((err) => {
                    client.reply(pesan.gagal)
                    console.log(err)
                })
        } else if (args.length === 0) {
            await databaseView('SELECT * FROM gmium')
                .then((result) => {
                    let text = '📝 Daftar *Premium* di bot ini\n'
                    const mentioned = []
                    if (result.length > 0) {
                        for (let i = 0; i < result.length; i++) {
                            const gid = result[i].gid
                            const waktu = result[i].waktu
                            const sign = result[i].signature
                            mentioned.push(sign)
                            const life = result[i].lifetime
                            text += `${i}. *GID*: ${gid}\n`
                            text += `    ├> *Lifetime*: ${life}\n`
                            text += `    ├> *Bersangkutan*: @${sign.replace('@s.whatsapp.net', '')}\n`
                            text += `    └> *Mulai*: ${waktu}\n`
                        }
                        client.mentions(`${text}`, mentioned, true)
                    } else {
                        text += '- Belum ada member'
                        client.reply(text)
                    }
                }).catch((err) => {
                    client.reply('Error mengambil database')
                    console.log(err)
                })
        }
    }
}

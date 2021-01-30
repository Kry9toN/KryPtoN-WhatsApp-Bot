export {}
const { databaseView, databaseInput } = require('../utils/db')

module.exports = {
    name: 'pmium',
    description: 'Untuk mengelola member premium user _only owner_',
    async execute (client: any, chat: any, pesan: any, args: any) {
        if (!client.isOwner && !client.isSudo) return client.reply(pesan.hanya.owner)
        const uid = args[1]
        if (args[0] === 'add') {
            databaseInput(`INSERT INTO pmium(uid) VALUES('${uid}')`)
                .then(() => {
                    client.reply('Berhasil menambahkan')
                }).catch((err: string) => {
                    client.reply('Gagal Menambahkan')
                    console.log(err)
                })
        } else if (args[0] === 'del') {
            const uid = args[1]
            databaseInput(`DELETE FROM pmium WHERE uid = '${uid}'`)
                .then(() => {
                    client.reply('Berhasil menghapus')
                }).catch((err: string) => {
                    client.reply('Gagal menghapus')
                    console.log(err)
                })
        } else if (args.length === 0) {
            await databaseView('SELECT * FROM pmium')
                .then((result: any) => {
                    let text = '📝 Daftar *Premium* di bot ini\n'
                    if (result.length > 0) {
                        for (let i = 0; i < result.length; i++) {
                            const uid = result[i].uid
                            const waktu = result[i].waktu
                            text += `${i}. uid: ${uid}\n`
                            text += `    └Mulai: ${waktu}\n`
                        }
                        client.reply(text)
                    } else {
                        text += '- Belum ada member'
                        client.reply(text)
                    }
                }).catch((err: string) => {
                    client.reply('Error mengambil database')
                    console.log(err)
                })
        }
    }
}

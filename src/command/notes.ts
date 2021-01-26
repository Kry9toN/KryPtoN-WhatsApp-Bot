export {}
const { databaseView, databaseInput } = require('../utils/db')

module.exports = {
    name: 'notes',
    cooldown: 15,
    description: 'Untuk menyimpan note atau catatan di group\nPenggunaan: !notes <save/remove> <key> <value>',
    async execute (client: any, chat: any, pesan: any, args: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGmium) return client.reply(pesan.hanya.premium)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        const arg = client.body.slice(6)
        const key = arg.split('|')[1].trim()
        const res = arg.split('|')[2].trim()
        if (args == 0) {
            await databaseView('SELECT * FROM notes')
                .then((hasil: any) => {
                    let text = 'Daftar *notes* di group ini\n\n'
                    if (hasil.length > 0) {
                        for (const list of hasil) {
                            if (list.gid == client.groupId) {
                                text += `- *${list.key}*`
                            }
                        }
                        client.reply(text)
                    } else {
                        text += '_Belum ada notes_'
                        client.reply(text)
                    }
                })
        } else if (args > 0 && arg.split('|')[0].trim() == 'save') {
            databaseInput(`INSERT INTO notes(gid, key, res) VALUES ('${client.groupId}', '#${key}', '${res}')`)
                .then(() => client.reply('Berhasil menambahkan notes'))
        } else if (args > 0 && arg.split('|')[0].trim() == 'remove') {
            databaseInput(`DELETE FROM notes WHERE key = ${key} AND gid = ${client.groupId}`)
                .then(() => client.reply(`Berhasil menghapus notes #${key}`))
        }
    }
}

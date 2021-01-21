const { databaseView, databaseInput } = require('../utils/db')

module.exports = {
    name: 'notes',
    aliases: ['nt'],
    description: 'Untuk menyimpan note atau catatan di group\nPenggunaan: !notes <save/remove> <key> <value>',
    async execute (client, chat, pesan, args) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGmium && !client.isOwner) return client.reply(pesan.error.premium)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        const key = args[1]
        const res = args[2]
        if (args == 0) {
            await databaseView('SELECT * FROM notes')
                .then((hasil) => {
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
        } else if (args > 0 && args[0] == 'save') {
            databaseInput(`INSERT INTO notes(gid, key, res) VALUES ('${client.groupId}', '#${key}', '${res}')`)
                .then(() => client.reply('Berhasil menambahkan notes'))
        } else if (args > 0 && args[0] == 'remove') {
            databaseInput(`DELETE FROM notes WHERE key = ${key} AND gid = ${client.groupId}`)
                .then(() => client.reply(`Berhasil menghapus notes #${key}`))
        }
    }
}

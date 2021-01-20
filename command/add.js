const { color } = require('../utils/color')

module.exports = {
    name: 'add',
    aliases: ['ad'],
    description: 'Untuk menambahkan orang ke group dengan nomor\nPenggunaan: !add 6285xxxx',
    // eslint-disable-next-line no-shadow-restricted-names
    execute (client, undefined, pesan, args) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        if (args.length < 1) return client.reply('Siapa yang mau lu add ?, demit ?')
        if (args[0].startsWith('08')) return client.reply('Jaman sudah canggih!!, masa masih pakai 0 awalannya')
        try {
            num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
            client.groupAdd(client.from, [num])
        } catch (e) {
            console.log('Error : %s', color(e, 'red'))
            client.reply('Gagal menambahkan target, mungkin karena di private')
        }
    }
}

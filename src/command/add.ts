export {}
const { color } = require('../utils/color')

module.exports = {
    name: 'add',
    aliases: ['ad'],
    description: 'Untuk menambahkan orang ke group dengan nomor\nPenggunaan: !add 6285xxxx',
    execute (client: any, chat: any, pesan: any, args:any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        if (args.length < 1) return client.reply('Siapa yang mau lu add ?, demit ?')
        if (args[0].startsWith('08')) return client.reply('Jaman sudah canggih!!, masa masih pakai 0 awalannya')
        try {
            const num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
            client.groupAdd(client.from, [num])
        } catch (e) {
            console.log('Error : %s', color(e, 'red'))
            client.reply('Gagal menambahkan target, mungkin karena di private')
            client.log(e)
        }
    }
}

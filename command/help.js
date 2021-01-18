const { MessageType } = require('@adiwajshing/baileys')

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'Menampilkan semua perintah dan deskripsi',
    execute (client, chat, pesan, args) {
        const commands = client.cmd.array()
        if (args.length == 0) {
           let text = `Daftar perintah di bot ini\n\nPrefix: !\n`
           commands.forEach((cmd) => {
               text += `- *${cmd.name}* ${cmd.aliases ? `(${cmd.aliases})` : ''}\n`
           })
           return client.reply(text)
        } else {
           const text = client.cmd.get(args[0]).description
           return client.reply(text)
        }
    }
}

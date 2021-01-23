module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'Menampilkan semua perintah dan deskripsi',
    execute (client, chat, pesan, args) {
        const commands = client.cmd.array()
        if (args.length == 0) {
            let text = 'Daftar perintah di bot ini\n\nPrefix: !\n'
            commands.forEach((cmd) => {
                text += `- *${cmd.name}* ${cmd.aliases ? `(${cmd.aliases})` : ''}\n`
            })
            text += '\nMasih bingung? ketik *!help <perintah>* akan menampilkan penggunaan perintah tersebut'
            return client.reply(text)
        } else {
            if (!client.cmd.has(args[0])) return client.reply('Perintah yang anda maksut tidak ada bro')
            const text = client.cmd.get(args[0]).description
            return client.reply(text)
        }
    }
}

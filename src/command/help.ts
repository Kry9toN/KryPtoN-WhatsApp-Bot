module.exports = {
    name: 'help',
    aliases: ['h'],
    cooldown: 10,
    description: 'Menampilkan semua perintah dan deskripsi',
    execute (client: any, chat: any, pesan: any, args: any) {
        const commands = client.cmd.array()
        if (args.length == 0) {
            let text = 'Daftar perintah di bot ini\n\nGabung ke group KryPtoN Bot: https://is.gd/wa0p84\nMonitoring Bot: https://wa.kry9ton.tech\n\nPrefix: !\n'
            commands.forEach((cmd: any) => {
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

const i18n = require('i18n')

module.exports = {
    name: 'help',
    aliases: ['h'],
    cooldown: 10,
    description: 'help.desc',
    execute (client: any, chat: any, pesan: any, args: any) {
        const commands = client.cmd.array()
        if (args.length == 0) {
            let text = i18n.__('help.startDialog')
            commands.forEach((cmd: any) => {
                text += `- *${cmd.name}* ${cmd.aliases ? `(${cmd.aliases})` : ''}\n`
            })
            text += i18n.__('help.endDialog')
            return client.reply(text)
        } else {
            if (!client.cmd.has(args[0])) return client.reply(i18n.__('help.notMatch'))
            const code = client.cmd.get(args[0]).description
            const text = i18n.__(code)
            return client.reply(text)
        }
    }
}

/*
 * This file is part of the KryPtoN Bot WA distribution (https://github.com/Kry9toN/KryPtoN-WhatsApp-Bot).
 * Copyright (c) 2021 Dhimas Bagus Prayoga.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import i18n from 'i18n'

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

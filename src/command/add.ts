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

import { color } from '../utils/color'
import i18n from 'i18n'

export = {
    name: 'add',
    aliases: ['ad'],
    cooldown: 20,
    description: 'add.desc',
    execute (client: any, chat: any, pesan: any, args: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        if (args.length < 1) return client.reply(i18n.__('add.noMentions'))
        if (args[0].startsWith('08')) return client.reply(i18n.__('help.codeNum'))
        try {
            const num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
            client.groupAdd(client.from, [num])
        } catch (e) {
            console.log('Error : %s', color(e, 'red'))
            client.reply(i18n.__('add.errAdd'))
            client.log(e)
        }
    }
}

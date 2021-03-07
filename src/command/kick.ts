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
    name: 'kick',
    aliases: ['k'],
    cooldown: 10,
    description: 'kik.desc',
    execute (client: any, chat: any, pesan: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        if (chat.message.extendedTextMessage === undefined || chat.message.extendedTextMessage === null) return client.reply(i18n.__('kick.noTag'))
        const mentions = client.quotedId || client.mentioned
        let mentioned
        if (!Array.isArray(mentions)) {
            mentioned = []
            mentioned.push(mentions)
        } else {
            mentioned = mentions
        }
        if (mentioned.includes(client.botNumber)) return client.reply(i18n.__('kick.self'))
        if (mentioned.length > 1) {
            let teks = i18n.__('kick.confirmed')
            for (const _ of mentioned) {
                teks += `@${_.split('@')[0]}\n`
            }
            client.mentions(teks, mentioned, true)
            client.groupRemove(client.from, mentioned)
        } else {
            client.mentions(i18n.__('kick.confirmedMention', { mentioned: mentioned[0].split('@')[0] }), mentioned, true)
            client.groupRemove(client.from, mentioned)
        }
    }
}

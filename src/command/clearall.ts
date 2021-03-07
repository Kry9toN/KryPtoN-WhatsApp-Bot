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
    name: 'clearall',
    aliases: ['ca'],
    description: 'clearall.desc',
    execute (client: any, chat: any, pesan: any) {
        if (!client.isOwner) return client.reply(pesan.hanya.owner)
        const chatAll = client.chats.all()
        client.setMaxListeners(25)
        for (const chat of chatAll) {
            client.deleteChat(chat.jid)
        }
        client.reply(i18n.__('clearall.clearDone'))
    }
}

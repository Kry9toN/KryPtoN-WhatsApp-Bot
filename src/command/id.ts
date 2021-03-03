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

const i18n = require('i18n')

module.exports = {
    name: 'id',
    cooldown: 10,
    description: 'id.desc',
    execute (client: any, chat: any, pesan: any) {
        const uid = client.sender
        if (client.isGroup) {
            const gid = client.groupId
            client.reply(i18n.__('id.gId', { uid: uid, gid: gid }))
        } else {
            client.reply(i18n.__('id.uId', { uid: uid }))
        }
    }
}

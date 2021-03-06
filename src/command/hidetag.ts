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

module.exports = {
    name: 'hidetag',
    aliases: ['ht'],
    cooldown: 45,
    description: 'hidetag.desc',
    execute (client: any, chat: any, pesan: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        const value = client.body.slice(9)
        const memberList = []
        for (const member of client.groupMembers) {
            memberList.push(member.jid)
        }
        const options = {
            text: value,
            contextInfo: { mentionedJid: memberList },
            quoted: chat
        }
        client.sendMess(client.from, options)
    }
}

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

export {}
const { MessageType } = require('@adiwajshing/baileys')
const i18n = require('i18n')

module.exports = {
    name: 'fakereply',
    aliases: ['fr', 'fake', 'fitnah'],
    cooldown: 35,
    description: 'fakeReply.desc',
    execute (client: any, chat: any, pesan: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        const arg = client.body.slice(9)
        const targets = arg.split('|')[1]
        const bot = arg.split('|')[2]
        if (targets == 'undefined' || bot == 'undefined') return client.reply(i18n.__('fakeReply.error'))
        const mentioned = chat.message.extendedTextMessage.contextInfo.mentionedJid
        client.sendMessage(client.from, `${bot}`, MessageType.text, { quoted: { key: { fromMe: false, participant: `${mentioned}`, ...(client.from ? { remoteJid: client.from } : {}) }, message: { conversation: `${targets}` } } })
    }
}

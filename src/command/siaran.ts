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

/* eslint-disable no-mixed-operators */
import { MessageType } from '@adiwajshing/baileys'

module.exports = {
    name: 'siaran',
    description: 'Untuk mengelola member premium group _only owner_',
    async execute (client: any, chat: any, pesan: any, args: any) {
        if (!client.isOwner && !client.isSudo) return client.reply(pesan.hanya.owner)
        if (args.length < 1) return client.reply('Ra onok tulisan')
        const chatAll = await client.chats.all()
        if (client.isMedia && !chat.message.videoMessage || client.isQuotedImage) {
            const encmedia = client.isQuotedImage ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const buff = await client.downloadMediaMessage(encmedia)
            for (const _ of chatAll) {
                client.sendMessage(_.jid, buff, MessageType.image, { caption: `❮ *KryPtoN Bot Broadcast* ❯\n\n${client.body.slice(7)}` })
            }
            client.reply('Berhasil mengirim siaran')
        } else {
            for (const _ of chatAll) {
                client.sendMess(_.jid, `❮ *KryPtoN Bot Broadcast* ❯\n\n${client.body.slice(8)}`)
            }
            client.reply('*Berhasil mengirim siaran*')
        }
    }
}

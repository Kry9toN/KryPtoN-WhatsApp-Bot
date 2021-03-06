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

import { MessageType } from '@adiwajshing/baileys'
import { getBuffer } from '../utils/functions'
import { fetchJson } from '../utils/fetcher'

module.exports = {
    name: 'nulis3',
    aliases: ['n3'],
    cooldown: 50,
    description: 'Untuk menuliskan di buku bot\nPenggunaan !nulis3 _tulisan_',
    execute (client: any, chat: any, pesan: any, args: any) {
        const value = args.slice().join(' ')
        fetchJson(`https://tools.zone-xsec.com/api/nulis.php?q=${value}`, { method: 'get' })
            .then(async (hasil: any) => {
                client.reply(pesan.tunggu)
                const image = await getBuffer(hasil.image, { method: 'get' })
                client.sendMessage(client.from, image, MessageType.image, { quoted: chat, caption: pesan.berhasil })
            }).catch((err: string) => {
                console.log(err)
                client.log(err)
            })
    }
}

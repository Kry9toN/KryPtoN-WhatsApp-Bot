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

const { fetchJson } = require('../utils/fetcher')

module.exports = {
    name: 'paste',
    cooldown: 20,
    description: 'Untuk memaste text yang direply ke Dogbin\nPenggunaan: _quoted pesan_ !paste',
    execute (client: any, chat: any, pesan: any, args: any) {
        client.reply(pesan.tunggu)
        const DOGBIN = 'https://del.dog/'
        const text = client.type === 'extendedTextMessage' ? chat.message.extendedTextMessage.contextInfo.quotedMessage.conversation : client.body.slice(7)
        const options = {
            method: 'POST',
            body: `${text}`
        }
        fetchJson(DOGBIN + 'documents', options)
            .then((hasil: any) => {
                if (hasil.key == undefined) return client.reply('Paste gagal!, mungkin karena text anda mengandung custom font/emotikon')
                client.reply(`Paste berhasil\nDogbin URL: ${DOGBIN + hasil.key}`)
            })
    }
}

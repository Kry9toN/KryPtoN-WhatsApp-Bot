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
const moment = require('moment-timezone')
const { processTime } = require('../utils/functions')

module.exports = {
    name: 'ping',
    cooldown: 10,
    description: 'Menampilkan rata-rata bot merespon',
    execute (client: any) {
        client.sendMessage(client.from, `Pong!!\n${processTime(client.pingStart, moment())} _detik_`, MessageType.text).catch(console.error)
    }
}

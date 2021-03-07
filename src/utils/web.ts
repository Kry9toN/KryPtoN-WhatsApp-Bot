/* eslint-disable @typescript-eslint/no-var-requires */
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

// REQUIRE NPM PACKAGES
import { MessageType } from '@adiwajshing/baileys'
import http from 'http'
import express from 'express'
const app = express()
const httpServer = http.createServer(app)
const osUtils = require('node-os-utils')
import os from 'os'
const io = require('socket.io')(httpServer)
import { color } from './color'

export const web = async (client: any) => {
    const apiKey = process.env.WEB_API
    // View Engine and static public folder
    app.set('view engine', 'ejs')
    app.use(express.static('./views'))

    // Root Route
    app.get('/', (req: any, res: any) => {
        res.render('index.ejs')
    })

    app.get('/send', (req: any, res: any) => {
        const id = req.query.id
        const text = req.query.text
        const api = req.query.api
        if (api !== apiKey) return res.json({ info: 'Api Key salah', status: 502 })
        client.sendMessage(id, text, MessageType.text)
            .then(() => {
                res.json({ info: 'Berhasil mengirim', status: 200 })
            }).catch((err: string) => res.json({ info: err, status: 502 }))
    })

    // CPU USAGE
    const cpu = osUtils.cpu

    // USER and OS
    const username = os.userInfo({ encoding: 'buffer' }).username
    const osInfo = os.type()

    // SOCKET IO
    io.on('connection', (socket: any) => {
        console.log(color(`[INFO] ${socket.id} Server socket connected`, 'green'))
        // USE SET INTERVAL TO CHECK RAM USAGE EVERY SECOND
        setInterval(async () => {
        // RAM USED tot - free
            const ramUsed = Math.round(os.totalmem()) - Math.round(os.freemem())
            // RAM percentage
            const ram = (ramUsed * 100 / Math.round(os.totalmem())).toFixed(0)
            // Uptime and Chat
            const chat = await client.chats.all().length
            const uptime = Math.round(process.uptime()).toFixed(0)

            // CPU USAGE PERCENTAGE
            cpu.usage().then((cpu: number) => socket.emit('ram-usage', { ram, cpu, username, osInfo, chat, uptime, loging }))
        }, 1000)
    })

    // Run the server
    const PORT = process.env.PORT || 4242
    httpServer.listen(PORT, () => {
        console.log(color('[INFO] Web api Server on port: ', 'green') + color(`${PORT}`, 'yellow'))
    })
}

export const loging = (client: any) => {
    let loging
    if (!client.isGroup && client.isCmd) loging = `=> ${client.time} ${client.commandName} from ${client.sender.split('@')[0]}`
    if (!client.isGroup && !client.isCmd) loging = `=> ${client.time} Message from ${client.sender.split('@')[0]}`
    if (client.isCmd && client.isGroup) loging = `=> ${client.time} ${client.commandName} from ${client.sender.split('@')[0]} in ${client.groupName}`
    if (!client.isCmd && client.isGroup) loging = `=> ${client.time} Message from ${client.sender.split('@')[0]} in ${client.groupName}`
    io.emit('log', { loging })
}

export const qrCode = (qr: string) => {
    io.emit('qr-regen', { qr })
}

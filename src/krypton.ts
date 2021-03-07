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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WAConnection } = require('@adiwajshing/baileys')
import { MessageType } from '@adiwajshing/baileys'
import { Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'
import { start, success, getGroupAdmins } from './utils/functions'
import { color } from './utils/color'
import fs from 'fs'
import moment from 'moment-timezone'
import { welcome, goodbye } from './utils/greeting'
import { databaseView } from './utils/db'
import { web, loging, qrCode } from './utils/web'
import i18n from 'i18n'
import getLocale from './utils/locale'

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

async function krypton () {
    const client = new WAConnection()
    client.cmd = new Collection()
    client.runtimeDb = new Collection()
    client.botNumber = process.env.BOT_NUMBER
    const cooldowns = new Collection()

    // Initial locale
    require('./include/locale')

    // Web API client
    web(client)

    // Initial db
    require('./include/db')

    client.logger.level = 'warn'

    client.browserDescription = ['KryPtoN', 'Chrome', '87']

    await client.on('qr', (qr: string) => {
        console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color(' Scan the QR code above', 'blue'))
        qr = encodeURIComponent(qr)
        qrCode(qr)
    })

    // Connect to sessions if already exist
    if (fs.existsSync('./sessions/krypton-sessions.json')) {
        await client.loadAuthInfo('./sessions/krypton-sessions.json')
        await client.on('connecting', () => {
            start('1', '[INFO] Menyambungkan ke sessions yang sudah ada...')
        })
    }

    // Server connecting
    if (!fs.existsSync('./sessions/krypton-sessions.json')) {
        await client.on('connecting', () => {
            start('1', '[INFO] Menunggu scan code QR untuk menyambungkan...')
        })
    }

    // Server connected
    await client.on('open', () => {
        success('1', '[INFO] Terhubung')
        console.log('🤖', color('KryPtoN Bot Sudah siap!!', 'green'))
    })

    // Create file for sessions
    await client.connect({ timeoutMs: 30 * 1000 })
    fs.writeFileSync('./sessions/krypton-sessions.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

    // Notes event
    client.on('message', async ({ client }: any) => {
        const keyWord = client.body.toLowerCase()
        // Notes
        await databaseView('SELECT * FROM notes')
            .then((hasil: any) => {
                const filterBaseString = JSON.stringify(hasil)
                if (filterBaseString.includes(client.groupId)) {
                    for (let i = 0; i < hasil.length; i++) {
                        if (keyWord.includes(hasil[i].key && hasil[i].gid == client.groupId)) {
                            const resMessage = hasil[i].res
                            client.reply(resMessage)
                        }
                    }
                }
            }).catch((err: string) => console.log(err))
    })

    await client.on('group-participants-update', async (greeting: any) => {
        try {
            const num = greeting.participants[0]
            const mdata = await client.groupMetadata(greeting.jid)
            const name = client.contacts[num] != undefined ? client.contacts[num].vname || client.contacts[num].notify : undefined
            const ppimg = await client.getProfilePicture(`${greeting.participants[0].split('@')[0]}@c.us`)
            if (greeting.action == 'add') {
                console.log(color('~', 'yellow'), color('EXEC', 'red'), client.time, 'client', color(greeting.participants[0].split('@')[0], 'yellow'), 'Masuk ke group', color(mdata.subject, 'blue'))
                await welcome(name, mdata.subject, ppimg).then(async (hasil: any) => {
                    await client.sendMessage(mdata.id, hasil, MessageType.image)
                })
            } else if (greeting.action == 'remove') {
                console.log(color('~', 'yellow'), color('EXEC', 'red'), client.time, 'client', color(greeting.participants[0].split('@')[0], 'yellow'), 'Keluar dari group', color(mdata.subject, 'blue'))
                await goodbye(name, mdata.subject, ppimg).then(async (hasil: any) => {
                    await client.sendMessage(mdata.id, hasil, MessageType.image)
                })
            }
        } catch (e) {
            console.log('[INFO] : %s', color(e, 'red'))
        }
    })

    await client.on('chat-update', async (chat: any) => {
        if (!chat.hasNewMessage) return
        client.pingStart = chat.t
        chat = chat.messages.all()[0]
        if (!chat.message) return
        if (chat.key.remoteJid == 'status@broadcast') return
        if (chat.key.fromMe) return
        client.time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
        client.apiKey = process.env.API_KEY
        const prefix = '!'

        // Variable
        client.type = Object.keys(chat.message)[0]
        client.body = client.type === 'conversation' ? chat.message.conversation : (client.type == 'imageMessage') ? chat.message.imageMessage.caption : (client.type == 'videoMessage') ? chat.message.videoMessage.caption : (client.type == 'extendedTextMessage') ? chat.message.extendedTextMessage.text : ''
        const args = client.body.trim().split(/ +/).slice(1)
        client.isCmd = client.body.startsWith(prefix)
        client.commandName = client.body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const content = JSON.stringify(chat.message)
        const botNumber = client.user.jid
        const ownerNumber = process.env.OWNER_PHONE // Isi di .env
        const logGroup = process.env.LOGGING // Isi di .env
        client.from = chat.key.remoteJid
        exports.ID = client.from
        client.isGroup = client.from.endsWith('@g.us')
        client.sender = client.isGroup ? chat.participant : chat.key.remoteJid
        const groupMetadata = client.isGroup ? await client.groupMetadata(client.from) : ''
        client.groupName = client.isGroup ? groupMetadata.subject : ''
        client.groupMembers = client.isGroup ? groupMetadata.participants : ''
        client.groupAdmins = client.isGroup ? getGroupAdmins(client.groupMembers) : ''
        client.groupId = client.isGroup ? groupMetadata.id : ''
        client.isBotGroupAdmins = client.groupAdmins.includes(botNumber) || false
        client.isGroupAdmins = client.groupAdmins.includes(client.sender) || false
        client.isOwner = client.sender.includes(ownerNumber)
        client.isUrl = (url: string) => {
            // eslint-disable-next-line prefer-regex-literals
            return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }
        client.reply = (teks: string) => {
            client.sendMessage(client.from, teks, MessageType.text, { quoted: chat })
        }
        client.sendMess = (id: number, text: string) => {
            client.sendMessage(id, text, MessageType.text)
        }
        client.mentions = (teks: string, id: number, bolean: boolean) => {
            (bolean == null || bolean == undefined || bolean == false) ? client.sendMessage(client.from, teks.trim(), MessageType.extendedText, { contextInfo: { mentionedJid: id } }) : client.sendMessage(client.from, teks.trim(), MessageType.extendedText, { quoted: chat, contextInfo: { mentionedJid: id } })
        }
        client.log = (error: string) => {
            client.sendMessage(logGroup, `[LOGGING] command: *${client.commandName}* ${error}`, MessageType.text)
        }

        client.isMedia = (client.type === 'imageMessage' || client.type === 'videoMessage')
        client.isQuotedImage = client.type === 'extendedTextMessage' && content.includes('imageMessage')
        client.isQuotedVideo = client.type === 'extendedTextMessage' && content.includes('videoMessage')
        client.isQuotedSticker = client.type === 'extendedTextMessage' && content.includes('stickerMessage')
        client.quotedId = client.type === 'extendedTextMessage' ? chat.message.extendedTextMessage.contextInfo.participant : ''
        client.mentioned = client.type === 'extendedTextMessage' ? chat.message.extendedTextMessage.contextInfo.mentionedJid : ''

        // Premuim
        const viewPm = await databaseView('SELECT * FROM pmium')
        const pmWhiteList = JSON.stringify(viewPm)
        client.isPmium = pmWhiteList.includes(client.sender)

        const viewGc = await databaseView('SELECT * FROM gmium')
        const gcWhiteList = JSON.stringify(viewGc)
        client.isGmium = gcWhiteList.includes(client.groupId)

        const sudo = await databaseView('SELECT * FROM sudo')
        const sList = JSON.stringify(sudo)
        client.isSudo = sList.includes(client.sender)

        // Web api proses
        loging(client)

        // Logging Message
        if (!client.isGroup && client.isCmd) console.log(color('~', 'yellow'), color('EXEC', 'red'), client.time, color(client.commandName, 'yellow'), 'from', color(client.sender.split('@')[0], 'yellow'), 'args :', color(args.length, 'blue'))
        if (!client.isGroup && !client.isCmd) console.log(color('~', 'yellow'), color('RECV', 'green'), client.time, color('Message', 'yellow'), 'from', color(client.sender.split('@')[0], 'yellow'), 'args :', color(args.length, 'blue'))
        if (client.isCmd && client.isGroup) console.log(color('~', 'yellow'), color('EXEC', 'red'), client.time, color(client.commandName, 'yellow'), 'from', color(client.sender.split('@')[0], 'yellow'), 'in', color(client.groupName, 'yellow'), 'args :', color(args.length, 'blue'))
        if (!client.isCmd && client.isGroup) console.log(color('~', 'yellow'), color('RECV', 'green'), client.time, color('Message', 'yellow'), 'from', color(client.sender.split('@')[0], 'yellow'), 'in', color(client.groupName, 'yellow'), 'args :', color(args.length, 'blue'))

        if (client.body.startsWith('#')) client.emit('message', { client })

        /**
            * Import all commands
        */
        const commandFiles = readdirSync(join(__dirname, 'command')).filter((file: string) => file.endsWith('.js'))
        for (const file of commandFiles) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const command = require(join(__dirname, 'command', `${file}`))
            client.cmd.set(command.name, command)
        }

        if (!client.isCmd) return

        const command =
        client.cmd.get(client.commandName) ||
        client.cmd.find((cmd: any) => cmd.aliases && cmd.aliases.includes(client.commandName))

        if (!command) return

        await getLocale(i18n, client.from)

        const pesan = {
            tunggu: i18n.__('bot.tunggu'),
            gagal: i18n.__('bot.gagal'),
            berhasil: i18n.__('bot.berhasil'),
            hanya: {
                admin: i18n.__('bot.admin'),
                botAdmin: i18n.__('bot.botAdmin'),
                owner: i18n.__('bot.owner'),
                premium: i18n.__('bot.premium')
            },
            error: {
                group: i18n.__('bot.group'),
                args: i18n.__('bot.args')
            }
        }

        // Time durations
        if ((!client.isGroup && !client.isPmium) || (client.isGroup && !client.isGmium)) {
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection())
            }

            const now = Date.now()
            const timestamps: any = cooldowns.get(command.name)
            const cooldownAmount = (command.cooldown || 1) * 1000

            if (timestamps.has(client.from)) {
                const expirationTime = timestamps.get(client.from) + cooldownAmount

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000
                    return client.sendMessage(client.from,
                        `[Slow mode] Mohon tunggu lebih dari ${timeLeft.toFixed(1)} detik sebelum menggunakan perintah *${command.name}* kembali.\n\n Berlangganan lah agar tidak selalu menunggu seperti ini, ketik *!pricing* untuk info harga, dll`,
                        MessageType.text
                    )
                }
            }

            timestamps.set(client.from, now)
            setTimeout(() => timestamps.delete(client.from), cooldownAmount)
        }

        try {
            command.execute(client, chat, pesan, args)
        } catch (e) {
            console.log('[INFO] : %s', color(e, 'red'))
            client.sendMessage(client.from, 'Telah terjadi error setelah menggunakan command ini.', MessageType.text)
            client.log(e)
        }
    })
}

krypton().catch((err) => console.log('[INFO] : %s', color(err, 'red')))

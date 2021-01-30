export {}
const {
    WAConnection, MessageType
} = require('@adiwajshing/baileys')
const { Collection } = require('discord.js')
const { readdirSync } = require('fs')
const { join } = require('path')
const { start, success, getGroupAdmins } = require('./utils/functions')
const { color } = require('./utils/color')
const fs = require('fs')
const moment = require('moment-timezone')
const { welcome, goodbye } = require('./utils/greeting')
const { databaseView, databaseInput } = require('./utils/db')
const { web, loging, qrCode } = require('./utils/web')
require('dotenv').config()

async function krypton () {
    const client = new WAConnection()
    client.cmd = new Collection()
    client.runtimeDb = new Collection()
    client.botNumber = process.env.BOT_NUMBER
    const cooldowns = new Collection()

    // Web API client
    web(client)

    /***
     * Initial Database
    **/
    // Black List
    databaseInput('CREATE TABLE IF NOT EXISTS blacklist( id VARCHAR(30) PRIMARY KEY NOT NULL , reason CHAR(225) DEFAULT \'No Reason\')')
        .catch((err: string) => console.log(err))
    // Filters
    databaseInput('CREATE TABLE IF NOT EXISTS filters( gid VARCHAR(50) NOT NULL , key VARCHAR(225) NOT NULL, res VARCHAR(225) NOT NULL )')
        .catch((err: string) => console.log(err))
    // Notes
    databaseInput('CREATE TABLE IF NOT EXISTS notes( gid VARCHAR(50) NOT NULL , key VARCHAR(225) NOT NULL, res VARCHAR(225) NOT NULL )')
        .catch((err: string) => console.log(err))
    // Premium
    databaseInput('CREATE TABLE IF NOT EXISTS gmium( gid VARCHAR(50) PRIMARY KEY NOT NULL, lifetime VARCHAR(10) NOT NULL, signature VARCHAR(30) NOT NULL, waktu TIMESTAMP NOT NULL DEFAULT now() )')
        .catch((err: string) => console.log(err))
    databaseInput('CREATE TABLE IF NOT EXISTS pmium( gid VARCHAR(50) PRIMARY KEY NOT NULL, waktu TIMESTAMP NOT NULL DEFAULT now() )')
        .catch((err: string) => console.log(err))
    // Blacklist text
    databaseInput('CREATE TABLE IF NOT EXISTS bllist( gid VARCHAR(50) NOT NULL , text VARCHAR(225) NOT NULL)')
        .catch((err: string) => console.log(err))
    // Blacklist user
    databaseInput('CREATE TABLE IF NOT EXISTS warn( gid VARCHAR(50) NOT NULL, uid VARCHAR(30) NOT NULL , warn VARCHAR(100) NOT NULL)')
        .catch((err: string) => console.log(err))
    // Sudo
    databaseInput('CREATE TABLE IF NOT EXISTS sudo( id VARCHAR(30) PRIMARY KEY NOT NULL )')
        .catch((err: string) => console.log(err))
    // Sudo
    databaseInput('CREATE TABLE IF NOT EXISTS afks( uid VARCHAR(30) PRIMARY KEY NOT NULL, afk VARCHAR(10) NOT NULL, reason CHAR(225) NOT NULL, timestart VARCHAR(100) NOT NULL )')
        .catch((err: string) => console.log(err))

    client.logger.level = 'warn'

    client.browserDescription = ['KryPtoN', 'Chrome', '87']

    await client.on('qr', (qr: string) => {
        console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color(' Scan the QR code above'))
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

    await client.on('group-participants-update', async (greeting: any) => {
        try {
            const num = greeting.participants[0]
            const mdata = await client.groupMetadata(greeting.jid)
            const name = client.contacts[num] != undefined ? client.contacts[num].vname || client.contacts[num].notify : undefined
            const ppimg = await client.getProfilePicture(`${greeting.participants[0].split('@')[0]}@c.us`)
            if (greeting.action == 'add') {
                console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', client.time, 'client', color(greeting.participants[0].split('@')[0]), 'Masuk ke group', color(mdata.subject))
                await welcome(name, mdata.subject, ppimg).then(async (hasil: Array<any>) => {
                    await client.sendMessage(mdata.id, hasil, MessageType.image)
                })
            } else if (greeting.action == 'remove') {
                console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', client.time, 'client', color(greeting.participants[0].split('@')[0]), 'Keluar dari group', color(mdata.subject))
                await goodbye(name, mdata.subject, ppimg).then(async (hasil: Array<any>) => {
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
        const type = Object.keys(chat.message)[0]
        client.body = type === 'conversation' ? chat.message.conversation : (type == 'imageMessage') ? chat.message.imageMessage.caption : (type == 'videoMessage') ? chat.message.videoMessage.caption : (type == 'extendedTextMessage') ? chat.message.extendedTextMessage.text : ''
        const args = client.body.trim().split(/ +/).slice(1)
        client.isCmd = client.body.startsWith(prefix)
        client.commandName = client.body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const content = JSON.stringify(chat.message)
        const botNumber = client.user.jid
        const ownerNumber = process.env.OWNER_PHONE // Isi di .env
        const logGroup = process.env.LOGGING // Isi di .env
        client.from = chat.key.remoteJid
        client.isGroup = client.from.endsWith('@g.us')
        client.sender = client.isGroup ? chat.participant : chat.key.remoteJid
        const groupMetadata = client.isGroup ? await client.groupMetadata(client.from) : ''
        client.groupName = client.isGroup ? groupMetadata.subject : ''
        client.groupMembers = client.isGroup ? groupMetadata.participants : ''
        const groupAdmins = client.isGroup ? getGroupAdmins(client.groupMembers) : ''
        client.groupId = client.isGroup ? groupMetadata.id : ''
        client.isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        client.isGroupAdmins = groupAdmins.includes(client.sender) || false
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

        client.isMedia = (type === 'imageMessage' || type === 'videoMessage')
        client.isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
        client.isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
        client.isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
        client.quotedId = type === 'extendedTextMessage' ? chat.message.extendedTextMessage.contextInfo.participant : ''
        client.mentioned = type === 'extendedTextMessage' ? chat.message.extendedTextMessage.contextInfo.mentionedJid : ''

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
        if (!client.isGroup && client.isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', client.time, color(client.commandName), 'client.from', color(client.sender.split('@')[0]), 'args :', color(args.length))
        if (!client.isGroup && !client.isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', client.time, color('Message'), 'client.from', color(client.sender.split('@')[0]), 'args :', color(args.length))
        if (client.isCmd && client.isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', client.time, color(client.commandName), 'client.from', color(client.sender.split('@')[0]), 'in', color(client.groupName), 'args :', color(args.length))
        if (!client.isCmd && client.isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', client.time, color('Message'), 'client.from', color(client.sender.split('@')[0]), 'in', color(client.groupName), 'args :', color(args.length))

        const pesan = {
            tunggu: '⌛ Sedang di Prosess ⌛',
            gagal: '❌ Gagal melaksanakan perintah ❌',
            berhasil: '✔️ Berhasil ✔️',
            hanya: {
                admin: '❌ Perintah ini hanya bisa di gunakan oleh admin group! ❌',
                botAdmin: '❌ Perintah ini hanya bisa di gunakan ketika bot menjadi admin! ❌',
                owner: '❌ Perintah hanya untuk owner/sudo! ❌',
                premium: '❌ Perintah hanya untuk pelanggan premium! ❌'
            },
            error: {
                group: '❌ Perintah ini hanya bisa di gunakan dalam group! ❌',
                args: '❌ Perintah anda salah! ❌'
            }
        }

        if (client.body.startWith('#')) client.emit('message', client)

        /**
            * Import all commands
        */
        const commandFiles = readdirSync(join(__dirname, 'command')).filter((file: string) => file.endsWith('.js'))
        for (const file of commandFiles) {
            const command = require(join(__dirname, 'command', `${file}`))
            client.cmd.set(command.name, command)
        }

        if (!client.isCmd) return

        const command =
        client.cmd.get(client.commandName) ||
        client.cmd.find((cmd: any) => cmd.aliases && cmd.aliases.includes(client.commandName))

        if (!command) return

        // Time durations
        if ((!client.isGroup && !client.isPmium) || (client.isGroup && !client.isGmium)) {
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection())
            }

            const now = Date.now()
            const timestamps = cooldowns.get(command.name)
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

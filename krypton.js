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

async function krypton () {
    const client = new WAConnection()
    client.cmd = new Collection()
    const cooldowns = new Collection()
    client.logger.level = 'warn'
    // console.log(banner.string)
    await client.on('qr', () => {
        console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color(' Scan the QR code above'))
    })

    // Connect to sessions if already exist
    if (fs.existsSync('./sessions/krypton-sessions.json')) {
        await client.loadAuthInfo('./sessions/krypton-sessions.json')
        await client.on('connecting', () => {
            start('1', '[SERVER] Menyambungkan ke sessions yang sudah ada...')
        })
    }

    // Server connecting
    if (!fs.existsSync('./sessions/krypton-sessions.json')) {
        await client.on('connecting', () => {
            start('1', '[SERVER] Menunggu scan code QR untuk menyambungkan...')
        })
    }

    // Server connected
    await client.on('open', () => {
        success('1', '[SERVER] Terhubung')
        console.log('🤖', color('KryPtoN Bot Sudah siap!!', 'green'))
    })

    // Create file for sessions
    await client.connect({ timeoutMs: 30 * 1000 })
    fs.writeFileSync('./sessions/krypton-sessions.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

    await client.on('group-participants-update', async (greeting) => {
        try {
            const mdata = await client.groupMetadata(greeting.jid)
            if (greeting.action == 'add') {
                console.log(console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, 'client', color(greeting.participants[0].split('@')[0]), 'Masuk ke group', color(mdata.subject))
                num = greeting.participants[0]
                ppimg = await client.getProfilePicture(`${greeting.participants[0].split('@')[0]}@c.us`)
                await welcome('uwu', mdata.subject, ppimg).then(async (hasil) => {
                    await client.sendMessage(mdata.id, hasil, MessageType.image)
                })
            } else if (greeting.action == 'remove') {
                console.log(console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, 'client', color(greeting.participants[0].split('@')[0]), 'Keluar dari group', color(mdata.subject))
                num = greeting.participants[0]
                ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
                await goodbye('uwu', mdata.subject, ppimg).then(async (hasil) => {
                    await client.sendMessage(mdata.id, hasil, MessageType.image)
                })
            }
        } catch (e) {
            console.log('Error : %s', color(e, 'red'))
        }
    })

    await client.on('chat-update', async (chat) => {
        client.pingStart = Date.now()
        if (!chat.hasNewMessage) return
        const prefix = '!'
        chat = JSON.parse(JSON.stringify(chat)).messages[0]
        if (!chat.message) return
        if (chat.key.remoteJid == 'status@broadcast') return
        if (chat.key.fromMe) return

        // Variable
        const type = Object.keys(chat.message)[0]
        body = (type === 'conversation' && chat.message.conversation.startsWith(prefix)) ? chat.message.conversation : (type == 'imageMessage') && chat.message.imageMessage.caption.startsWith(prefix) ? chat.message.imageMessage.caption : (type == 'videoMessage') && chat.message.videoMessage.caption.startsWith(prefix) ? chat.message.videoMessage.caption : (type == 'extendedTextMessage') && chat.message.extendedTextMessage.text.startsWith(prefix) ? chat.message.extendedTextMessage.text : ''
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const commandName = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
        const content = JSON.stringify(chat.message)

        const botNumber = client.user.jid
        const ownerNumber = ['6285892766102@s.whatsapp.net'] // replace this with your number
        const sender = client.isGroup ? chat.participant : chat.key.remoteJid
        const groupMetadata = client.isGroup ? await client.groupMetadata(client.from) : ''
        const groupName = client.isGroup ? groupMetadata.subject : ''
        const groupMembers = client.isGroup ? groupMetadata.participants : ''
        const groupAdmins = client.isGroup ? getGroupAdmins(groupMembers) : ''
        client.from = chat.key.remoteJid
        client.isGroup = client.from.endsWith('@g.us')
        client.groupId = client.isGroup ? groupMetadata.jid : ''
        client.isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        client.isGroupAdmins = groupAdmins.includes(sender) || false
        client.isOwner = ownerNumber.includes(sender)
        client.isUrl = (url) => {
            // eslint-disable-next-line prefer-regex-literals
            return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
        }
        client.reply = (teks) => {
            client.sendMessage(client.from, teks, text, { quoted: chat })
        }
        client.sendMess = (hehe, teks) => {
            client.sendMessage(hehe, teks, text)
        }
        client.mentions = (teks, memberr, id) => {
            (id == null || id == undefined || id == false) ? client.sendMessage(client.from, teks.trim(), extendedText, { contextInfo: { mentionedJid: memberr } }) : client.sendMessage(client.from, teks.trim(), extendedText, { quoted: chat, contextInfo: { mentionedJid: memberr } })
        }

        colors = ['red', 'white', 'black', 'blue', 'yellow', 'green']
        client.isMedia = (type === 'imageMessage' || type === 'videoMessage')
        client.isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
        client.isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
        client.isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')

        // Logging Message
        if (!client.isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(commandName), 'client.from', color(sender.split('@')[0]), 'args :', color(args.length))
        if (!client.isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'client.from', color(sender.split('@')[0]), 'args :', color(args.length))
        if (isCmd && client.isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(commandName), 'client.from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
        if (!isCmd && client.isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'client.from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))

        /**
            * Import all commands
        */
        const commandFiles = readdirSync(join(__dirname, 'command')).filter((file) => file.endsWith('.js'))
        for (const file of commandFiles) {
            const command = require(join(__dirname, 'command', `${file}`))
            client.cmd.set(command.name, command)
        }

        if (!isCmd) return

        const command =
        client.cmd.get(commandName) ||
        client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

        if (!command) return

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
                    `Mohon tunggu lebih dari ${timeLeft.toFixed(1)} detik sebelum menggunakan perintah ini *${command.name}*.`,
                    MessageType.text
                )
            }
        }

        timestamps.set(client.from, now)
        setTimeout(() => timestamps.delete(client.from), cooldownAmount)

        try {
            command.execute(client, args)
        } catch (e) {
            console.log('Error : %s', color(e, 'red'))
            client.sendMessage(client.from, 'Telah terjadi error setelah menggunakan command ini.', MessageType.text).catch(console.error)
        }
    })
}

krypton().catch((err) => console.log(err))

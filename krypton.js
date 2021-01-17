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

    await client.on('chat-update', async (chat) => {
        client.pingStart = Date.now()
        if (!chat.hasNewMessage) return
        const prefix = '!'
        chat = JSON.parse(JSON.stringify(chat)).messages[0]
        if (!chat.message) return
        if (chat.key.remoteJid == 'status@broadcast') return
        if (chat.key.fromMe) return

        // Variable
        const from = chat.key.remoteJid
        const type = Object.keys(chat.message)[0]
        body = (type === 'conversation' && chat.message.conversation.startsWith(prefix)) ? chat.message.conversation : (type == 'imageMessage') && chat.message.imageMessage.caption.startsWith(prefix) ? chat.message.imageMessage.caption : (type == 'videoMessage') && chat.message.videoMessage.caption.startsWith(prefix) ? chat.message.videoMessage.caption : (type == 'extendedTextMessage') && chat.message.extendedTextMessage.text.startsWith(prefix) ? chat.message.extendedTextMessage.text : ''
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const commandName = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
        const content = JSON.stringify(chat.message)

        const botNumber = client.user.jid
			const ownerNumber = ["6285892766102@s.whatsapp.net"] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? chat.participant : chat.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:chat})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: chat, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')

        // Logging Message
        if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(commandName), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
        if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
        if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(commandName), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
        if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))

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

        if (timestamps.has(from)) {
            const expirationTime = timestamps.get(from) + cooldownAmount

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return client.sendMessage(from,
                    `Mohon tunggu lebih dari ${timeLeft.toFixed(1)} detik sebelum menggunakan perintah ini *${command.name}*.`,
                    MessageType.text
                )
            }
        }

        timestamps.set(from, now)
        setTimeout(() => timestamps.delete(from), cooldownAmount)

        try {
            command.execute(client, from, args)
        } catch (error) {
            console.error(error)
            client.sendMessage(from, 'Telah terjadi error setelah menggunakan command ini.', MessageType.text).catch(console.error)
        }
    })
}

krypton().catch((err) => console.log(err))

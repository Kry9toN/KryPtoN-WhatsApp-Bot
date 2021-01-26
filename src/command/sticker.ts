/* eslint-disable no-mixed-operators */
export {}
const { MessageType } = require('@adiwajshing/baileys')
const { exec } = require('child_process')
const { getRandom } = require('../utils/functions')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const { removeBackgroundFromImageFile } = require('remove.bg')

module.exports = {
    name: 'sticker',
    aliases: ['s', 'st'],
    cooldown: 600,
    description: 'Untuk menjadikan video atau gambar menjadi sticker\nPenggunaan: quoted gambar/vidio !sticker <rbg/nobg> rbg: remove background, nobg: no background on sticker, default sticker dengan background',
    async execute (client: any, chat: any, pesan: any, args: any) {
        if ((client.isMedia && !chat.message.videoMessage || client.isQuotedImage) && args[0] == 'nobg') {
            if ((!client.isGroup && !client.isPmium) || (client.isGroup && !client.isGmium)) return client.reply(pesan.hanya.premium)
            const encmedia = client.isQuotedImage ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const media = await client.downloadAndSaveMediaMessage(encmedia)
            const ranw = getRandom('.webp')
            client.reply(pesan.tunggu)
            await ffmpeg(`./${media}`)
                .input(media)
                .on('start', function (cmd: string) {
                    console.log(`[INFO] Started : ${cmd}`)
                })
                .on('error', function (err: string) {
                    console.log(`[INFO] Error : ${err}`)
                    fs.unlinkSync(media)
                    client.reply('Error saat membuat sticker')
                    client.log(err)
                })
                .on('end', function () {
                    console.log('[INFO] Berhasil membuat sticker')
                    client.sendMessage(client.from, fs.readFileSync(ranw), MessageType.sticker, { quoted: chat })
                    fs.unlinkSync(media)
                    fs.unlinkSync(ranw)
                })
                .addOutputOptions(['-vcodec', 'libwebp', '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse'])
                .toFormat('webp')
                .save(ranw)
        } else if ((client.isMedia && chat.message.videoMessage.seconds < 11 || client.isQuotedVideo && chat.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
            if ((!client.isGroup && !client.isPmium) || (client.isGroup && !client.isGmium)) return client.reply(pesan.hanya.premium)
            const encmedia = client.isQuotedVideo ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const media = await client.downloadAndSaveMediaMessage(encmedia)
            const ranw = getRandom('.webp')
            client.reply(pesan.tunggu)
            await ffmpeg(`./${media}`)
                .inputFormat(media.split('.')[1])
                .on('start', function (cmd: string) {
                    console.log(`[INFO] Started : ${cmd}`)
                })
                .on('error', function (err: string) {
                    console.log(`[INFO] Error : ${err}`)
                    fs.unlinkSync(media)
                    const tipe = media.endsWith('.mp4') ? 'video' : 'gif'
                    client.reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
                    client.log(err)
                })
                .on('end', function () {
                    console.log('[INFO] Berhasil membuat sticker')
                    client.sendMessage(client.from, fs.readFileSync(ranw), MessageType.sticker, { quoted: chat })
                    fs.unlinkSync(media)
                    fs.unlinkSync(ranw)
                })
                .addOutputOptions(['-vcodec', 'libwebp', '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse'])
                .toFormat('webp')
                .save(ranw)
        } else if ((client.isMedia || client.isQuotedImage) && args[0] == 'rbg') {
            if ((!client.isGroup && !client.isPmium) || (client.isGroup && !client.isGmium)) return client.reply(pesan.hanya.premium)
            const encmedia = client.isQuotedImage ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const media = await client.downloadAndSaveMediaMessage(encmedia)
            const ranw = getRandom('.webp')
            const ranp = getRandom('.png')
            client.reply(pesan.tunggu)
            const keyrmbg = process.env.KEY_REMOVEBG
            await removeBackgroundFromImageFile({ path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp }).then((res: any) => {
                fs.unlinkSync(media)
                const buffer = Buffer.from(res.base64img, 'base64')
                fs.writeFileSync(ranp, buffer, (err: string) => {
                    if (err) return client.reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
                })
                exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err: string) => {
                    fs.unlinkSync(ranp)
                    if (err) return client.reply('Error saat membuat sticker')
                    client.sendMessage(client.from, fs.readFileSync(ranw), MessageType.sticker, { quoted: chat })
                })
            })
        } else if ((client.isMedia || client.isQuotedImage) && args.length == 0) {
            const encmedia = client.isQuotedImage ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const media = await client.downloadAndSaveMediaMessage(encmedia)
            const ranw = getRandom('.webp')
            await ffmpeg(`./${media}`)
                .on('start', function (cmd: any) {
                    console.log('[INFO] Started :', cmd)
                })
                .on('error', function (err: any) {
                    fs.unlinkSync(media)
                    console.log('[INFO] Error :', err)
                    client.reply('Error saat membuat sticker')
                    client.log(err)
                })
                .on('end', function () {
                    console.log('[INFO] Berhasil membuat sticker')
                    client.sendMessage(client.from, fs.readFileSync(ranw), MessageType.sticker, { quoted: chat })
                    fs.unlinkSync(media)
                    fs.unlinkSync(ranw)
                })
                .addOutputOptions(['-vcodec', 'libwebp', '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=off [p]; [b][p] paletteuse'])
                .toFormat('webp')
                .save(ranw)
        } else {
            client.reply('Kirim gambar dengan caption !sticker atau tag gambar yang sudah dikirim')
        }
    }
}

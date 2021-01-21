/* eslint-disable no-mixed-operators */
const { exec } = require('child_process')
const { getRandom } = require('../utils/functions')

module.exports = {
    name: 'sticker',
    aliases: ['s', 'st'],
    description: 'Untuk menyimpan note atau catatan di group\nPenggunaan: !notes <save/remove> <key> <value>',
    async execute (client, chat, pesan, args) {
        if (!client.isPmium && !client.isOwner) return client.reply(pesan.error.premium)
        const encmedia = client.isQuotedImage ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
        const media = await client.downloadAndSaveMediaMessage(encmedia)
        ranw = getRandom('.webp')
        ranp = getRandom('.png')
        if ((client.isMedia && !chat.message.videoMessage || client.isQuotedImage) && args.length == 0) {
            await ffmpeg(`./${media}`)
                .input(media)
                .on('start', function (cmd) {
                    console.log(`Started : ${cmd}`)
                })
                .on('error', function (err) {
                    console.log(`Error : ${err}`)
                    fs.unlinkSync(media)
                    client.reply(mess.error.stick)
                })
                .on('end', function () {
                    console.log('Finish')
                    client.sendMessage(client.from, fs.readFileSync(ranw), sticker, { quoted: chat })
                    fs.unlinkSync(media)
                    fs.unlinkSync(ranw)
                })
                .addOutputOptions(['-vcodec', 'libwebp', '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse'])
                .toFormat('webp')
                .save(ranw)
        } else if ((client.isMedia && chat.message.videoMessage.seconds < 11 || client.isQuotedVideo && chat.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
            client.reply(mess.wait)
            await ffmpeg(`./${media}`)
                .inputFormat(media.split('.')[1])
                .on('start', function (cmd) {
                    console.log(`Started : ${cmd}`)
                })
                .on('error', function (err) {
                    console.log(`Error : ${err}`)
                    fs.unlinkSync(media)
                    tipe = media.endsWith('.mp4') ? 'video' : 'gif'
                    client.reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
                })
                .on('end', function () {
                    console.log('Finish')
                    client.sendMessage(client.from, fs.readFileSync(ranw), sticker, { quoted: chat })
                    fs.unlinkSync(media)
                    fs.unlinkSync(ranw)
                })
                .addOutputOptions(['-vcodec', 'libwebp', '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse'])
                .toFormat('webp')
                .save(ranw)
        } else if ((client.isMedia || client.isQuotedImage) && args[0] == 'nobg') {
            client.reply(mess.wait)
            keyrmbg = process.env.KEY_REMOVEBG
            await removeBackgroundclient.fromImageFile({ path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp }).then(res => {
                fs.unlinkSync(media)
                const buffer = Buffer.client.from(res.base64img, 'base64')
                fs.writeFileSync(ranp, buffer, (err) => {
                    if (err) return client.reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
                })
                exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
                    fs.unlinkSync(ranp)
                    if (err) return client.reply(mess.error.stick)
                    client.sendMessage(client.from, fs.readFileSync(ranw), sticker, { quoted: chat })
                })
            })
        /* } else if ((client.isMedia || client.isQuotedImage) && colors.includes(args[0])) {
            await ffmpeg(`./${media}`)
                .on('start', function (cmd) {
                    console.log('Started :', cmd)
                })
                .on('error', function (err) {
                    fs.unlinkSync(media)
                    console.log('Error :', err)
                })
                .on('end', function () {
                    console.log('Finish')
                    fs.unlinkSync(media)
                    client.sendMessage(client.from, fs.readFileSync(ran), sticker, {quoted: chat})
                    fs.unlinkSync(ran)
                })
                .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
                .toFormat('webp')
                .save(ran) */
        } else {
            client.reply('Kirim gambar dengan caption !sticker atau tag gambar yang sudah dikirim')
        }
    }
}

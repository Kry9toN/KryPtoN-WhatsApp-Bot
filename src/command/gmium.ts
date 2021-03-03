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
const { databaseView, databaseInput } = require('../utils/db')
const i18n = require('i18n')

module.exports = {
    name: 'gmium',
    aliases: ['gm'],
    description: 'gmium.desc',
    async execute (client: any, chat: any, pesan: any, args: any) {
        if (!client.isOwner && !client.isSudo) return client.reply(pesan.hanya.owner)
        const gid = args[1]
        if (args[0] === 'add') {
            const mentioned = chat.message.extendedTextMessage.contextInfo.mentionedJid
            const sign = mentioned[0]
            if (args[1] === 'unlimited') {
                if (chat.message.extendedTextMessage === undefined || chat.message.extendedTextMessage === null) return client.reply('Tag yang bersangkutan!')
                const gid = args[2]
                databaseInput(`INSERT INTO gmium(gid, lifetime, signature) VALUES('${gid}', 'unlimited', '${sign}')`)
                    .then(() => {
                        client.reply(pesan.berhasil)
                    }).catch((err: string) => {
                        client.reply(pesan.gagal)
                        console.log(err)
                        client.log(err)
                    })
            } else {
                databaseInput(`INSERT INTO gmium(gid, lifetime, signature) VALUES('${gid}', 'standard', '${sign}')`)
                    .then(() => {
                        client.reply(pesan.berhasil)
                    }).catch((err: string) => {
                        client.reply(pesan.gagal)
                        console.log(err)
                        client.log(err)
                    })
            }
        } else if (args[0] === 'del') {
            databaseInput(`DELETE FROM gmium WHERE gid = '${gid}'`)
                .then(() => {
                    client.reply(pesan.berhasil)
                }).catch((err: string) => {
                    client.reply(pesan.gagal)
                    console.log(err)
                    client.log(err)
                })
        } else if (args.length === 0) {
            await databaseView('SELECT * FROM gmium')
                .then((result: any) => {
                    let text = i18n.__('gmium.startDialog')
                    const mentioned = []
                    if (result.length > 0) {
                        for (let i = 0; i < result.length; i++) {
                            const gid = result[i].gid
                            const waktu = result[i].waktu
                            const sign = result[i].signature
                            mentioned.push(sign)
                            const life = result[i].lifetime
                            text += `${i}. *GID*: ${gid}\n`
                            text += `    ├> ${i18n.__('gmium.lifetime')} ${life}\n`
                            text += `    ├> ${i18n.__('gmium.sign')} @${sign.replace('@s.whatsapp.net', '')}\n`
                            text += `    └> ${i18n.__('gmium.start')} ${waktu}\n`
                        }
                        client.mentions(`${text}`, mentioned, true)
                    } else {
                        text += i18n.__('gmium.noMember')
                        client.reply(text)
                    }
                }).catch((err: string) => {
                    client.reply(i18n.__('gmium.errorDb'))
                    console.log(err)
                    client.log(err)
                })
        }
    }
}

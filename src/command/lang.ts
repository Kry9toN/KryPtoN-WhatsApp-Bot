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

module.exports = {
    name: 'lang',
    cooldown: 15,
    description: 'lang.desc',
    async execute (client: any, chat: any, pesan: any, args: any) {
        const list = ['en', 'id']
        if (args[0] == 'set' && list.includes(args[1])) {
            const lang = args[1]
            if (client.isGroup) {
                const from = client.from
                if (!client.isGmium) return client.reply(pesan.hanya.premium)
                if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
                if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
                await databaseView(`SELECT EXISTS ( SELECT id FROM locales WHERE id = '${from}' )`)
                    .then((hasil: any) => {
                        if (hasil[0].exists == true) {
                            databaseInput(`UPDATE locales SET locale = '${lang}' WHERE id = '${from}'`).then(() => {
                                client.reply(i18n.__('lang.update'))
                            })
                        } else {
                            databaseInput(`INSERT INTO locales(id, locale) VALUES('${from}' ,'${lang}')`).then(() => {
                                client.reply(i18n.__('lang.setup'))
                            })
                        }
                    })
            } else {
                const from = client.from
                if (!client.isPmium) return client.reply(pesan.hanya.premium)
                await databaseView(`SELECT EXISTS ( SELECT id FROM locales WHERE id = '${from}' )`)
                    .then((hasil: any) => {
                        if (hasil[0].exists == true) {
                            databaseInput(`UPDATE locales SET locale = '${lang}' WHERE id = '${from}'`).then(() => {
                                client.reply(i18n.__('lang.update'))
                            })
                        } else {
                            databaseInput(`INSERT INTO locales(id, locale) VALUES('${from}' ,'${lang}')`).then(() => {
                                client.reply(i18n.__('lang.setup'))
                            })
                        }
                    })
            }
        } else {
            client.reply(i18n.__('lang.notFound', { list: list.toString }))
        }
    }
}

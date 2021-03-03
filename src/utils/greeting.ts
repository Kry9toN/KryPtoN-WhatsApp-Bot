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
const Canvas = require('wa-canvas')

const welcome = (pushname: string, gcname: string, picprofil: string) => new Promise((resolve, reject) => {
    async function welcome () {
        const image = await new Canvas.Welcome()
            .setUsername(pushname)
            .setGuildName(gcname)
            .setAvatar(picprofil)
            .setColor('border', '#8015EA')
            .setColor('username-box', '#8015EA')
            .setColor('message-box', '#8015EA')
            .setColor('title', '#8015EA')
            .setColor('avatar', '#8015EA')
            .toAttachment()

        const buff = image.toBuffer()
        return buff
    }
    welcome().then((hasil) => resolve(hasil)).catch((err) => {
        reject(err)
    })
})

const goodbye = (pushname: string, gcname: string, picprofil: string) => new Promise((resolve, reject) => {
    async function goodbye () {
        const image = await new Canvas.Goodbye()
            .setUsername(pushname)
            .setGuildName(gcname)
            .setAvatar(picprofil)
            .setColor('border', '#8015EA')
            .setColor('username-box', '#8015EA')
            .setColor('message-box', '#8015EA')
            .setColor('title', '#8015EA')
            .setColor('avatar', '#8015EA')
            .toAttachment()

        const buff = image.toBuffer()
        return buff
    }
    goodbye().then((hasil) => resolve(hasil)).catch((err) => {
        reject(err)
    })
})

module.exports = {
    welcome,
    goodbye
}

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
let Spin = require('spinnies')
import moment from 'moment-timezone'
import axios from 'axios'
import { exec } from 'child_process'

const spinner = {
    interval: 120,
    frames: [
        '🕐',
        '🕑',
        '🕒',
        '🕓',
        '🕔',
        '🕕',
        '🕖',
        '🕗',
        '🕘',
        '🕙',
        '🕚',
        '🕛'
    ]
}

let globalSpinner: string

export const getGlobalSpinner = (disableSpins = false) => {
    if (!globalSpinner) globalSpinner = new Spin({ color: 'blue', succeedColor: 'green', spinner, disableSpins })
    return globalSpinner
}

Spin = getGlobalSpinner(false)

export const start = (id: string, text: string) => {
    Spin.add(id, { text: text })
}

export const success = (id: string, text: string) => {
    Spin.succeed(id, { text: text })
}

/**
 * Get Time duration
 * @param  {Date} timestamp
 * @param  {Date} now
 */
export const processTime = (timestamp: number, now: any) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - (timestamp * 1000)).asSeconds()
}

export const getGroupAdmins = (participants: Array<any>) => {
    const admins = []
    for (const i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
}

export const getBuffer = async (url: string, options: any) => {
    try {
        options || {}
        const res = await axios({
            method: 'get',
            url,
            headers: {
                DNT: 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (e) {
        console.log(`Error : ${e}`)
    }
}

export const getRandom = (ext: string) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

export const term = (param: string) => new Promise((resolve, reject) => {
    console.log('Run terminal =>', param)
    exec(param, (error: any, stdout: string, stderr: string) => {
        if (error) {
            console.log(error.message)
            resolve(error.message)
        }
        if (stderr) {
            console.log(stderr)
            resolve(stderr)
        }
        console.log(stdout)
        resolve(stdout)
    })
})

export const restart = () => {
    setTimeout(function () {
        // Kapan NodeJs keluar
        process.on('exit', function () {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            require('child_process').spawn(process.argv.shift(), process.argv, {
                cwd: process.cwd(),
                detached: true,
                stdio: 'inherit'
            })
        })
        process.exit()
    }, 2000)
}

export {}
let Spin = require('spinnies')
const moment = require('moment-timezone')
const axios = require('axios')
const cfonts = require('cfonts')

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

let globalSpinner

const getGlobalSpinner = (disableSpins = false) => {
    if (!globalSpinner) globalSpinner = new Spin({ color: 'blue', succeedColor: 'green', spinner, disableSpins })
    return globalSpinner
}

Spin = getGlobalSpinner(false)

const start = (id, text) => {
    Spin.add(id, { text: text })
}

const success = (id, text) => {
    Spin.succeed(id, { text: text })
}

/**
 * Get Time duration
 * @param  {Date} timestamp
 * @param  {Date} now
 */
const processTime = (timestamp, now) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const getGroupAdmins = (participants) => {
    const admins = []
    for (const i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
}

const banner = cfonts.render(('KRYPTON|WHATSAPP|BOT'), {
    font: 'block',
    colors: ['red', 'blue'],
    align: 'center',
    lineHeight: 2
})

const getBuffer = async (url, options) => {
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

const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

module.exports = {
    start,
    success,
    processTime,
    getGroupAdmins,
    banner,
    getBuffer,
    getRandom
}

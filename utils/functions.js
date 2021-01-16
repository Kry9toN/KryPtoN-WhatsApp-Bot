const Spin = require('spinnies')
const moment = require('moment-timezone')

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

spins = getGlobalSpinner(false)

const start = (id, text) => {
    spins.add(id, { text: text })
}

const success = (id, text) => {
    spins.succeed(id, { text: text })
}

/**
 * Get Time duration
 * @param  {Date} timestamp
 * @param  {Date} now
 */
const processTime = (timestamp, now) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - moment(timestamp)).asSeconds()
}

module.exports = {
    start,
    success,
    processTime
}

const Spin = require('spinnies')

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

module.exports = {
    start,
    success
}

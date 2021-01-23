const { execSync } = require('child_process')
const cfonts = require('cfonts')
const chalk = require('chalk')

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const banner = cfonts.render(('KRYPTON|WHATSAPP|BOT'), {
    font: 'block',
    colors: ['red', 'blue'],
    align: 'center',
    lineHeight: 2
})

start()

function start () {
    console.info(banner.string)
    console.info(color('[INFO] Compiling source...', 'yellow'))
    execSync('npm run compile')
    console.info(color('[INFO] Done compiling, starting the bot...', 'green'))
    require('./dist/krypton.js')
}

const { execSync } = require('child_process')

start()

function start () {
    console.info('[INFO] Compiling source...')
    execSync('npm run compile')
    console.info('[INFO] Done compiling, starting the bot...')
    require('./dist/krypton.js')
}

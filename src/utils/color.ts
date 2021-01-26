export {}
const chalk = require('chalk')

const color = (text: string, color: string) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const bgcolor = (text: string, bgcolor: string) => {
    return !bgcolor ? chalk.green(text) : chalk.bgKeyword(bgcolor)(text)
}

module.exports = {
    color,
    bgcolor
}

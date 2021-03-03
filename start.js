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

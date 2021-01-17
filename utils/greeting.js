const Canvas = require('canvas')
const path = require('path')
const { applyText } = require('../utils')

// Font
// Register Bold font
Canvas.registerFont(path.join(__dirname, '/../assets/fonts/theboldfont.ttf'), { family: 'Bold' })
// Register SketchMatch font
Canvas.registerFont(path.join(__dirname, '/../assets/fonts/SketchMatch.ttf'), { family: 'SketchMatch' })
// Register SketchMatch font
Canvas.registerFont(path.join(__dirname, '/../assets/fonts/LuckiestGuy-Regular.ttf'), { family: 'luckiest guy' })
// Register KeepCalm font
Canvas.registerFont(path.join(__dirname, '/../assets/fonts/KeepCalm-Medium.ttf'), { family: 'KeepCalm' })

const welcome = (pushname, gcname, picprofil) => new Promise((resolve, reject) => {
    // Create canvas
    const canvas = Canvas.createCanvas(1024, 450)
    const ctx = canvas.getContext('2d')

    const gcName = `Welcome in ${gcname}`

    // Draw background
    ctx.fillStyle = '000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const background = Canvas.loadImage(path.join(__dirname, '/../assets/img/1px.png'))
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    // Draw layer
    ctx.fillStyle = '#000000'
    ctx.globalAlpha = '0.4'
    ctx.fillRect(0, 0, 25, canvas.height)
    ctx.fillRect(canvas.width - 25, 0, 25, canvas.height)
    ctx.fillRect(25, 0, canvas.width - 50, 25)
    ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25)
    ctx.fillStyle = '#000000'
    ctx.globalAlpha = '0.4'
    ctx.fillRect(344, canvas.height - 296, 625, 65)
    ctx.fillRect(308, canvas.height - 160, 672, 65)

    // Draw username
    ctx.globalAlpha = 1
    ctx.fillStyle = '#ffffff'
    ctx.font = applyText(canvas, pushname, 48, 600, 'Bold')
    ctx.fillText(pushname, canvas.width - 660, canvas.height - 248)

    // Draw guild name
    ctx.fillStyle = '#ffffff'
    ctx.font = applyText(canvas, gcName, 53, 600, 'Bold')
    ctx.fillText(gcName, canvas.width - 690, canvas.height - 110)

    // Draw title
    ctx.font = '90px Bold'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 15
    ctx.strokeText('WELCOME', canvas.width - 620, canvas.height - 330)
    ctx.fillStyle = '#df0909'
    ctx.fillText('WELCOME', canvas.width - 620, canvas.height - 330)

    // Draw avatar circle
    ctx.beginPath()
    ctx.lineWidth = 10
    ctx.arc(180, 225, 135, 0, Math.PI * 2, true)
    ctx.stroke()
    ctx.closePath()
    ctx.clip()
    const avatar = Canvas.loadImage(picprofil)
    ctx.drawImage(avatar, 45, 90, 270, 270)

    const buff = canvas.toBuffer()
    const base64 = `data:image/png;base64,${buff.toString('base64')}`
    resolve(base64)
})

const goodbye = (pushname, gcname, picprofil) => new Promise((resolve, reject) => {
    // Create canvas
    const canvas = Canvas.createCanvas(1024, 450)
    const ctx = canvas.getContext('2d')

    const gcName = `Leaving from ${gcname}`

    // Draw background
    ctx.fillStyle = '000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const background = Canvas.loadImage(path.join(__dirname, '/../assets/img/1px.png'))
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    // Draw layer
    ctx.fillStyle = '#000000'
    ctx.globalAlpha = '0.4'
    ctx.fillRect(0, 0, 25, canvas.height)
    ctx.fillRect(canvas.width - 25, 0, 25, canvas.height)
    ctx.fillRect(25, 0, canvas.width - 50, 25)
    ctx.fillRect(25, canvas.height - 25, canvas.width - 50, 25)
    ctx.fillStyle = '#000000'
    ctx.globalAlpha = '0.4'
    ctx.fillRect(344, canvas.height - 296, 625, 65)
    ctx.fillRect(308, canvas.height - 160, 672, 65)

    // Draw username
    ctx.globalAlpha = 1
    ctx.fillStyle = '#ffffff'
    ctx.font = applyText(canvas, pushname, 48, 600, 'Bold')
    ctx.fillText(pushname, canvas.width - 660, canvas.height - 248)

    // Draw guild name
    ctx.fillStyle = '#ffffff'
    ctx.font = applyText(canvas, gcName, 53, 600, 'Bold')
    ctx.fillText(gcName, canvas.width - 690, canvas.height - 110)

    // Draw title
    ctx.font = '90px Bold'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 15
    ctx.strokeText('GOODBYE', canvas.width - 620, canvas.height - 330)
    ctx.fillStyle = '#df0909'
    ctx.fillText('GOODBYE', canvas.width - 620, canvas.height - 330)

    // Draw avatar circle
    ctx.beginPath()
    ctx.lineWidth = 10
    ctx.arc(180, 225, 135, 0, Math.PI * 2, true)
    ctx.stroke()
    ctx.closePath()
    ctx.clip()
    const avatar = Canvas.loadImage(picprofil)
    ctx.drawImage(avatar, 45, 90, 270, 270)

    const buff = canvas.toBuffer()
    const base64 = `data:image/png;base64,${buff.toString('base64')}`
    resolve(base64)
})

module.exports = {
    welcome,
    goodbye
}

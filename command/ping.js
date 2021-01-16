const { MessageType } = require('@adiwajshing/baileys')

module.exports = {
    name: 'ping',
    cooldown: 10,
    description: "Show the bot's average ping",
    execute (client, from) {
        client.sendMessage(from, 'oe', MessageType.text).catch(console.error)
    }
}

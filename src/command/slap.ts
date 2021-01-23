module.exports = {
    name: 'slap',
    cooldown: 10,
    description: 'Untuk menampol orang\nPenggunaan !slap _tag_',
    execute (client, chat, pesan, args) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (chat.message.extendedTextMessage === undefined || chat.message.extendedTextMessage === null) return client.reply('Tag target yang ingin di tonjok!')
        const mentioned = chat.message.extendedTextMessage.contextInfo.mentionedJid
        const tagList = []
        const dari = client.sender
        const target = mentioned[0]
        tagList.push(dari, target)
        const data = [
            `@${dari.split('@')[0]} melempar *pisang busuk* ke @${target.split('@')[0]}`,
            `@${dari.split('@')[0]} bersiap-siap untuk melempar *sekop* ke @${target.split('@')[0]}`,
            `@${dari.split('@')[0]} manapar dengan keras @${target.split('@')[0]} dengan *50jt TON truk*`,
            `@${dari.split('@')[0]} mulai *memukul* @${target.split('@')[0]} dengan sendok`,
            `@${dari.split('@')[0]} menjatuhkan *meteor* ke @${target.split('@')[0]}`,
            `@${dari.split('@')[0]} bersiap-siap *me-rasengan* @${target.split('@')[0]}`,
            `@${dari.split('@')[0]} menulis nama @${target.split('@')[0]} di *death note*`
        ]
        const dataslap = data[Math.floor(Math.random() * data.length)]
        client.mentions(`${dataslap}`, tagList, true)
    }
}

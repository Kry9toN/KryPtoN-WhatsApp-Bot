const { fetchJson } = require('../utils/fetcher')

module.exports = {
    name: 'paste',
    cooldown: 20,
    description: 'Untuk memaste text yang direply ke Dogbin\nPenggunaan: _quoted pesan_ !paste',
    execute (client: any, chat: any, pesan: any, args: any) {
        if (chat.message.extendedTextMessage === undefined || chat.message.extendedTextMessage === null) return client.reply('Reply pesan yang mau di paste!')
        client.reply(pesan.tunggu)
        const DOGBIN = 'https://del.dog/'
        const text = client.body.slice(7)
        const options = {
            method: 'POST',
            body: `data=${text}`
        }
        fetchJson(DOGBIN + 'documents', options)
            .then((hasil: any) => {
                client.reply(`Paste berhasil\nDogbin URL: ${DOGBIN + hasil.key}`)
            })
    }
}

const { fetchJson } = require('../utils/fetcher')

module.exports = {
    name: 'paste',
    cooldown: 20,
    description: 'Untuk memaste text yang direply ke Dogbin\nPenggunaan: _quoted pesan_ !paste',
    execute (client: any, chat: any, pesan: any, args: any) {
        client.reply(pesan.tunggu)
        const DOGBIN = 'https://del.dog/'
        const text = client.type === 'extendedTextMessage' ? chat.message.extendedTextMessage.contextInfo.quotedMessage.conversation : client.body.slice(7)
        const options = {
            method: 'POST',
            body: `${text}`
        }
        fetchJson(DOGBIN + 'documents', options)
            .then((hasil: any) => {
                if (hasil.key == undefined) return client.reply('Paste gagal!, mungkin karena text anda mengandung custom font/emotikon')
                client.reply(`Paste berhasil\nDogbin URL: ${DOGBIN + hasil.key}`)
            })
    }
}

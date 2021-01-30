const { WAConnection } = require('@adiwajshing/baileys')
const { databaseView } = require('./db')
const client = new WAConnection()
client.on('message', async (client: any, body: any) => {
    const keyWord = body.toLowerCase()
    // Notes
    await databaseView('SELECT * FROM notes')
        .then((hasil: Array<any>) => {
            const filterBaseString = JSON.stringify(hasil)
            if (filterBaseString.includes(client.groupId)) {
                for (let i = 0; i < hasil.length; i++) {
                    if (keyWord.includes(hasil[i].key.trim()) && hasil[i].gid.trim() == client.groupId) {
                        const resMessage = hasil[i].res.trim()
                        client.reply(resMessage)
                    }
                }
            }
        }).catch((err: any) => console.log(err))
})

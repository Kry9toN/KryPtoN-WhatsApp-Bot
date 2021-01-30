const { WAConnection } = require('@adiwajshing/baileys')
const { databaseView } = require('./db')
const client = new WAConnection()
client.on('message', async (client: any) => {
    const keyWord = client.body.toLowerCase()
    // Notes
    await databaseView('SELECT * FROM notes')
        .then((hasil: Array<any>) => {
            const filterBaseString = JSON.stringify(hasil)
            if (filterBaseString.includes(client.groupId)) {
                for (let i = 0; i < hasil.length; i++) {
                    if (keyWord.includes(hasil[i].key && hasil[i].gid == client.groupId)) {
                        const resMessage = hasil[i].res
                        client.reply(resMessage)
                    }
                }
            }
        }).catch((err: string) => console.log(err))
})

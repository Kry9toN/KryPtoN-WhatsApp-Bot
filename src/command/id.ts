module.exports = {
    name: 'id',
    cooldown: 10,
    description: 'Untuk menampilkan id group/user\nPenggunaan: !id',
    execute (client: any, chat: any, pesan: any) {
        const uid = client.sender
        if (client.isGroup) {
            const gid = client.groupId
            client.reply(`*ID* kamu : ${uid}\nGroup *ID* : ${gid}`)
        } else {
            client.reply(`*ID* kamu : ${uid}`)
        }
    }
}
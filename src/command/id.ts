const i18n = require('i18n')

module.exports = {
    name: 'id',
    cooldown: 10,
    description: 'id.desc',
    execute (client: any, chat: any, pesan: any) {
        const uid = client.sender
        if (client.isGroup) {
            const gid = client.groupId
            client.reply(i18n.__('id.gId', { uid: uid, gid: gid }))
        } else {
            client.reply(i18n.__('id.uId', { uid: uid }))
        }
    }
}

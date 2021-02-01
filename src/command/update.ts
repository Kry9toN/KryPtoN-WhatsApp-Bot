export {}
// using spawn in the child process module
const spawn = require('child_process').spawn
const { term, restart } = require('../utils/functions')
const {
    MessageType
} = require('@adiwajshing/baileys')

module.exports = {
    name: 'update',
    description: 'OTA UPDATE Untuk mengupdate bot _only owner_',
    async execute (client: any, chat: any, pesan: any, args: any) {
        const id = client.from
        const quoted = chat
        const remote = 'https://' + process.env.GIT_PW + '@github.com/Kry9toN/KryPtoN-WhatsApp-Bot'
        const herokuRemote = 'https://api:' + process.env.HEROKU_API + '@git.heroku.com/krypton-wa.git'
        const genLog = () => new Promise((resolve, reject) => {
            // start get log process
            const git = spawn('git', ['log', '--oneline', '--no-decorate', 'HEAD..upstream/master'])
            // buffer for data
            let buf = Buffer.alloc(0)
            // concat
            git.stdout.on('data', (data: any) => {
                buf = Buffer.concat([buf, data])
            })
            // if process error
            git.stderr.on('data', (data: any) => {
                reject(data.toString())
            })
            // when process is done
            git.on('close', () => {
                // convert to string and split based on end of line
                const subjects = buf.toString().split('\n')
                // pop the last empty string element
                subjects.pop()
                // log all subject names
                let text = 'Changelog KryPtoN bot:\n'
                subjects.forEach((sub) => {
                    text += `*${sub}*\n`
                })
                resolve(text)
            })
        })
        if (args.length == 0) {
            client.sendMessage(id, 'Checking OTA update....', MessageType.text, { quoted: quoted })
            term(`git remote add upstream ${remote}`)
                .then(() => {
                    term('git fetch upstream').then(() => {
                        genLog().then((data: any) => {
                            if (data.length < 30) {
                                client.sendMessage(id, 'Bot dalam kondisi terbaru', MessageType.text, { quoted: quoted })
                            } else {
                                client.sendMessage(id, `OTA UPDATE\n\n${data}\nKetik *!update now/deploy* untuk mengupdatenya`, MessageType.text, { quoted: quoted })
                            }
                        }).catch((err) => console.error(err))
                    }).catch((err: string) => console.error(err))
                }).catch((err: string) => console.error(err))
        } else if (args.length > 0 && args[0] == 'now') {
            if (!client.isOwner && !client.isSudo) return client.sendMessage(id, pesan.hanya.owner, MessageType.text, { quoted: quoted })
            client.sendMessage(id, 'Tunggu... bot sedang updating', MessageType.text, { quoted: quoted })
            term('git reset --hard FETCH_HEAD').then(() => {
                client.sendMessage(id, 'OTA Update berhasil\n Restarting bot....', MessageType.text, { quoted: quoted })
                restart()
            }).catch((err: string) => {
                console.log(err)
                client.log(err)
                client.sendMessage(id, 'OTA Update gagal/error', MessageType.text, { quoted: quoted })
            })
        } else if (args.length > 0 && args[0] == 'deploy') {
            if (!client.isOwner && !client.isSudo) return client.sendMessage(id, pesan.hanya.owner, MessageType.text, { quoted: quoted })
            client.sendMessage(id, 'Tunggu... bot sedang updating', MessageType.text, { quoted: quoted })
            term('git reset --hard FETCH_HEAD').then(() => {
                term(`git remote add heroku ${herokuRemote}`).then(() => {
                    term('git push heroku HEAD:refs/heads/master -f').then(() => {
                        client.sendMessage(id, 'OTA Update berhasil\n Restarting bot....', MessageType.text, { quoted: quoted })
                        restart()
                    }).catch((err: string) => {
                        console.log(err)
                        client.log(err)
                        client.sendMessage(id, 'OTA Update gagal/error saat menambah remote', MessageType.text, { quoted: quoted })
                    })
                }).catch((err: string) => {
                    console.log(err)
                    client.log(err)
                    client.sendMessage(id, 'OTA Update gagal/error saat deploying', MessageType.text, { quoted: quoted })
                })
            }).catch((err: string) => {
                console.log(err)
                client.log(err)
                client.sendMessage(id, 'OTA Update gagal/error', MessageType.text, { quoted: quoted })
            })
        }
    }
}

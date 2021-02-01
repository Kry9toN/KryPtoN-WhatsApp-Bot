export {}
// using spawn in the child process module
const spawn = require('child_process').spawn
const { term, restart } = require('../utils/functions')

module.exports = {
    name: 'update',
    description: 'OTA UPDATE Untuk mengupdate bot _only owner_',
    async execute (client: any, chat: any, pesan: any, args: any) {
        const remote = 'https://' + process.env.GIT_PW + '@github.com/Kry9toN/KryPtoN-WhatsApp-Bot'
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
                let text: any
                subjects.forEach((sub) => {
                    text += sub
                })
                resolve(text)
            })
        })
        if (args.length == 0) {
            client.reply('Checking OTA update....')
            term(`git remote add upstream ${remote}`)
                .then(() => {
                    term('git fetch upstream').then(() => {
                        genLog().then((data: any) => {
                            if (data.length < 4) {
                                client.reply('Bot dalam kondisi terbaru')
                            } else {
                                client.reply(`OTA UPDATE\n\nChangelog KryPtoN bot:\n${data}\n\nKetik *!update now* untuk mengupdatenya`)
                            }
                        }).catch((err) => console.error(err))
                    }).catch((err: string) => console.error(err))
                }).catch((err: string) => console.error(err))
        } else if (args.length > 0 && args[0] == 'now') {
            if (!client.isOwner && !client.isSudo) return client.reply(pesan.hanya.owner)
            client.reply('Tunggu... bot sedang updating')
            term('git reset --hard FETCH_HEAD').then(() => {
                client.reply('OTA Update berhasil\n Restarting bot....')
                restart()
            }).catch((err: string) => {
                console.log(err)
                client.log(err)
                client.reply('OTA Update gagal/error')
            })
        }
    }
}

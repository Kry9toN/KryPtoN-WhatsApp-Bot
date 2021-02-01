export {}
// using spawn in the child process module
const spawn = require('child_process').spawn

module.exports = {
    name: 'update',
    description: 'Untuk mengelola member premium group _only owner_',
    async execute (client: any, chat: any, pesan: any, args: any) {
        if (!client.isOwner && !client.isSudo) return client.reply(pesan.hanya.owner)
        const genLog = () => {
            // start get log process
            const git = spawn('git', ['log', '--oneline', '--no-decorate', 'HEAD..upstream/master'])
            // buffer for data
            let buf = Buffer.alloc(0)
            // concat
            git.stdout.on('data', (data) => {
                buf = Buffer.concat([buf, data])
            })
            // if process error
            git.stderr.on('data', (data) => {
                console.log(data.toString())
            })
            // when process is done
            git.on('close', (code) => {
                // convert to string and split based on end of line
                const subjects = buf.toString().split('\n')
                // pop the last empty string element
                subjects.pop()
                // log all subject names
                subjects.forEach((sub) => {
                    console.log(sub)
                })
            })
        }
        if (args < 1) {
        }
    }
}

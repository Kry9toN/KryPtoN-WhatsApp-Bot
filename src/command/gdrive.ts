const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')
const { term } = require('../utils/functions')
const mime = require('mime-types')

module.exports = {
    name: 'gdrive',
    aliases: ['gd'],
    description: 'Untuk mendownload mengupload file ke Google Drive _only owner / VIP_',
    async execute (client: any, chat: any, pesan: any, args: any) {
        // If modifying these scopes, delete token.json.
        const SCOPES = ['https://www.googleapis.com/auth/drive']
        // The file token.json stores the user's access and refresh tokens, and is
        // created automatically when the authorization flow completes for the first
        // time.
        const TOKEN_PATH = path.join(__dirname, '../../token.json')
        const BASE_GD = 'https://drive.google.com/uc?id={}&export=download'

        /**
         * Create an OAuth2 client with the given credentials, and then execute the
         * given callback function.
         * @param {Object} credentials The authorization client credentials.
         * @param {function} callback The callback to call with the authorized client.
         */
        function authorize (credentials: any, callback: any) {
            // eslint-disable-next-line camelcase
            const { client_secret, client_id, redirect_uris } = credentials.installed
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0])

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, (err: boolean, token: string) => {
                if (err) return client.reply('Silakan regenerate token dengan cara *!gdrive auth*')
                oAuth2Client.setCredentials(JSON.parse(token))
                callback(oAuth2Client)
            })
        }

        if (args.length <= 1 && client.isUrl(args[0])) {
            /**
             * Describe with given media and metaData and upload it using google.drive.create method()
             */
            async function uploadFile (auth: string) {
                const url = args[0]
                client.reply('Mulai Download file')
                await term(`aria2c '${url}' --dir=$(pwd)/downloads`).then(() => {
                    client.reply('Download selesai')
                    client.reply('Mulai mengupload ke Google Drive\nMungkin membutuhkan waktu yang lama, tunggu aja')
                }).catch((err: string) => {
                    client.log(err)
                    client.reply('Download file gagal')
                    console.log(err)
                })

                await fs.readdir(path.join(__dirname, '../../downloads/'), async (err: boolean, nameFile: Array<any>) => {
                    if (err) return client.reply('File tidak di temukan di folder download')
                    // 'files' is an array of the files found in the directory

                    const name = nameFile[1]
                    const drive = google.drive({ version: 'v3', auth })
                interface meta {
                    name: string;
                    [parent: string]: any;
                }
                const fileMetadata: meta = {
                    name: name
                }
                if (process.env.GD_ID_DIR !== 'undefined') {
                    fileMetadata.parent = [process.env.GD_ID_DIR]
                }
                const type = mime.lookup(path.join(__dirname, `../../downloads/${nameFile[1]}`))
                const media = {
                    mimeType: type,
                    body: fs.createReadStream(path.join(__dirname, `../../downloads/${nameFile[1]}`))
                }
                await drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id, name'
                }, (err: string, file: any) => {
                    if (err) {
                        // Handle error
                        console.error(err)
                        client.log(`${err}`)
                        client.reply('Gagal saat mengupload file ke Google Drive')
                    } else {
                        client.reply(`Berhasil mengupload file\n🗒️ ${file.data.name}\nLink: ${BASE_GD.replace(/{}/g, file.data.id)}`)
                        term('rm -rf downloads/*')
                    }
                })
                })
            }

            // Load client secrets from a local file.
            fs.readFile(path.join(__dirname, '../../credentials.json'), (err: boolean, content: string) => {
                if (err) return client.log(`Error loading client secret file: ${err}`)
                // Authorize a client with credentials, then call the Google Drive API.
                authorize(JSON.parse(content), uploadFile)
            })
        } else if (args[0] == 'auth') {
            if (args.length == 1) {
                fs.readFile(path.join(__dirname, '../../credentials.json'), (err: boolean, content: any) => {
                    if (err) return client.reply(`Error loading client secret file: ${err}`)
                    const credentials = JSON.parse(content)
                    // eslint-disable-next-line camelcase
                    const { client_secret, client_id, redirect_uris } = credentials.installed
                    const oAuth2Client = new google.auth.OAuth2(
                        client_id, client_secret, redirect_uris[0])
                    // Check if we have previously stored a token.
                    fs.readFile(TOKEN_PATH, (err: boolean, token: string) => {
                        if (err) {
                            const authUrl = oAuth2Client.generateAuthUrl({
                                access_type: 'offline',
                                scope: SCOPES
                            })
                            client.reply(`Bukan url ini untuk mendapat kan code auth:  ${authUrl}\n\nKetik: !gdrive auth token <token> untuk confirmasi`)
                        }
                    })
                })
            } else if (args.length > 1 && args[1] === 'token') {
                fs.readFile(path.join(__dirname, '../../credentials.json'), (err: boolean, content: any) => {
                    if (err) return client.reply(`Error loading client secret file: ${err}`)
                    const credentials = JSON.parse(content)
                    // eslint-disable-next-line camelcase
                    const { client_secret, client_id, redirect_uris } = credentials.installed
                    const oAuth2Client = new google.auth.OAuth2(
                        client_id, client_secret, redirect_uris[0])
                    const code = args[1] == 'token' ? args[2] : ''
                    oAuth2Client.getToken(code, (err: boolean, token: string) => {
                        if (err) return client.reply(`Gagal mengakses token: ${err}`)
                        oAuth2Client.setCredentials(token)
                        // Store the token to disk for later program executions
                        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: string) => {
                            if (err) return console.error(err)
                            client.reply('Token refresh berhasil di buat')
                        })
                    })
                })
            }
        } else if (args[0] == 'list') {
            function listFiles (auth: string) {
                const drive = google.drive({ version: 'v3', auth })
                drive.files.list({
                    pageSize: 10,
                    fields: 'nextPageToken, files(id, name, mimeType, webViewLink, webContentLink)'
                }, (err: string, res: any) => {
                    if (err) return client.reply(`The API returned an error: ${err}`)
                    const files = res.data.files
                    if (files.length) {
                        let text = 'Gdrive list files:\n'
                        // eslint-disable-next-line array-callback-return
                        files.map((file: any) => {
                            if (file.mimeType == 'application/vnd.google-apps.folder') {
                                const link = file.webViewLink
                                text += `📂 *${file.name}*\nLink: ${link}\n\n`
                            } else {
                                const link = file.webContentLink
                                text += `🗒️ *${file.name}*\nLink: ${link}\n\n`
                            }
                        })
                        client.reply(text)
                    } else {
                        client.reply('No files found.')
                    }
                })
            }

            // Load client secrets from a local file.
            fs.readFile(path.join(__dirname, '../../credentials.json'), (err: boolean, content: string) => {
                if (err) return client.log(`Error loading client secret file: ${err}`)
                // Authorize a client with credentials, then call the Google Drive API.
                authorize(JSON.parse(content), listFiles)
            })
        } else if (args.length > 1 && args[0] == 'mkdir') {
            /**
             * Describe with given media and metaData and upload it using google.drive.create method()
             */
            function createFolder (auth: string) {
                client.reply(pesan.tunggu)
                const name = args[1]
                const drive = google.drive({ version: 'v3', auth })
                interface meta {
                    name: any;
                    mimeType: string;
                    [parent: string]: any;
                }
                const fileMetadata: meta = {
                    name: name,
                    mimeType: 'application/vnd.google-apps.folder'

                }
                if (process.env.GD_ID_DIR !== 'undefined') {
                    fileMetadata.parent = [process.env.GD_ID_DIR]
                }
                drive.files.create({
                    resource: fileMetadata,
                    fields: 'webViewLink, name'
                }, (err: string, file: any) => {
                    if (err) {
                        // Handle error
                        console.error(err)
                        client.log(`${err}`)
                        client.reply('Gagal saat mengupload file ke Google Drive')
                    } else {
                        client.reply(`Berhasil memebuat folder\n📂️ ${file.data.name} ${file.data.webViewLink}`)
                    }
                })
            }

            // Load client secrets from a local file.
            fs.readFile(path.join(__dirname, '../../credentials.json'), (err: boolean, content: string) => {
                if (err) return client.log(`Error loading client secret file: ${err}`)
                // Authorize a client with credentials, then call the Google Drive API.
                authorize(JSON.parse(content), createFolder)
            })
        }
    }
}

const fs = require('fs')
const path = require('path')
const { google } = require('googleapis')

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
                if (err) return getAccessToken(oAuth2Client, callback)
                oAuth2Client.setCredentials(JSON.parse(token))
                callback(oAuth2Client)
            })
        }

        /**
         * Get and store new token after prompting for user authorization, and then
         * execute the given callback with the authorized OAuth2 client.
         * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
         * @param {getEventsCallback} callback The callback for the authorized client.
         */
        function getAccessToken (oAuth2Client: any, callback: any) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            })
            client.reply(`Bukan url ini untuk mendapat kan code auth:  ${authUrl}\n\nKetik: !gdrive auth <code> untuk confirmasi`)
            const code = args[0] == 'auth' ? args[1] : ''
            oAuth2Client.getToken(code, (err: boolean, token: string) => {
                if (err) return console.error('Error retrieving access token', err)
                oAuth2Client.setCredentials(token)
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: string) => {
                    if (err) return console.error(err)
                    console.log('Token stored to', TOKEN_PATH)
                })
                callback(oAuth2Client)
            })
        }

        if (args < 1) {
            /**
             * Describe with given media and metaData and upload it using google.drive.create method()
             */
            function uploadFile (auth: string) {
                const drive = google.drive({ version: 'v3', auth })
                const fileMetadata = {
                    name: 'photo.jpg'
                }
                const media = {
                    mimeType: 'image/jpeg',
                    body: fs.createReadStream('files/photo.jpg')
                }
                drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'nextPageToken, files(id, name)'
                }, (err: string, file: any) => {
                    if (err) {
                        // Handle error
                        console.error(err)
                        client.log(err)
                    } else {
                        client.reply(`${file.name} ${BASE_GD.replace(/{}/g, file.id)}`)
                    }
                })
            }

            // Load client secrets from a local file.
            fs.readFile(path.join(__dirname, '../../credentials.json'), (err: boolean, content: string) => {
                if (err) return console.log('Error loading client secret file:', err)
                // Authorize a client with credentials, then call the Google Drive API.
                authorize(JSON.parse(content), uploadFile)
            })
        } else if (args[0] == 'auth') {
            if (args < 1) {
                fs.readFile(path.join(__dirname, '../../credentials.json'), (err: boolean, credentials: any) => {
                    if (err) return client.reply(`Error loading client secret file: ${err}`)
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
                            client.reply(`Bukan url ini untuk mendapat kan code auth:  ${authUrl}\n\nKetik: !gdrive auth <code> untuk confirmasi`)
                        }
                    })
                })
            } else {
                fs.readFile(path.join(__dirname, '../../credentials.json'), (err: boolean, credentials: any) => {
                    if (err) return client.reply(`Error loading client secret file: ${err}`)
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
                    fields: 'nextPageToken, files(id, name)'
                }, (err: string, res: any) => {
                    if (err) return console.log('The API returned an error: ' + err)
                    const files = res.data.files
                    if (files.length) {
                        let text = 'Gdrive list files:'
                        // eslint-disable-next-line array-callback-return
                        files.map((file: any) => {
                            text += `${file.name} ${BASE_GD.replace(/{}/g, file.id)}`
                        })
                        client.reply(text)
                    } else {
                        client.reply('No files found.')
                    }
                })
            }

            // Load client secrets from a local file.
            fs.readFile(path.join(__dirname, '../../credentials.json'), (err: boolean, content: string) => {
                if (err) return console.log('Error loading client secret file:', err)
                // Authorize a client with credentials, then call the Google Drive API.
                authorize(JSON.parse(content), listFiles)
            })
        }
    }
}

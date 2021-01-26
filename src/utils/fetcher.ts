export {}
const fetch = require('node-fetch')
const fs = require('fs')

const getBase64 = async (url: string) => {
    const response = await fetch(url, { headers: { 'User-Agent': 'okhttp/4.5.0' } })
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const buffer = await response.buffer()
    const videoBase64 = `data:${response.headers.get('content-type')};base64,` + buffer.toString('base64')
    if (buffer) { return videoBase64 }
}

const getBuffer = async (url: string) => {
    const res = await fetch(url, { headers: { 'User-Agent': 'okhttp/4.5.0' }, method: 'GET' })
    const anu = fs.readFileSync('./src/emror.jpg')
    if (!res.ok) return { type: 'image/jpeg', result: anu }
    const buff = await res.buffer()
    if (buff) { return { type: res.headers.get('content-type'), result: buff } }
}

const fetchJson = (url: string, options: Array<any>) => new Promise((resolve, reject) => {
    fetch(url, options)
        .then((response: any) => response.json())
        .then((json: object) => {
            // console.log(json)
            resolve(json)
        })
        .catch((err: string) => {
            reject(err)
        })
})

const fetchText = (url: string, options: Array<any>) => new Promise((resolve, reject) => {
    fetch(url, options)
        .then((response: any) => response.text())
        .then((text: string) => {
            // console.log(text)
            resolve(text)
        })
        .catch((err: string) => {
            reject(err)
        })
})

// exports.getBase64 = getBase64;

module.exports = {
    getBase64,
    getBuffer,
    fetchJson,
    fetchText
}

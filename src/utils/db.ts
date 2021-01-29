export {}
require('dotenv').config()
const { Pool } = require('pg')
const optionsAndoid = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PW,
    port: 5432
}
const options = {
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 2500,
    idleTimeoutMillis: 2000,
    max: 10000
}
const pool = new Pool(process.platform == 'android' ? optionsAndoid : options)

const databaseInput = (value: string) => new Promise((resolve, reject) => {
    pool.query(value, (err: string, result: any) => {
        if (err) {
            console.error(err)
            reject(err)
        }
        resolve(result)
    })
})

const databaseView = (value: string) => new Promise((resolve, reject) => {
    pool.query(value, (err: string, result: any) => {
        if (err) {
            console.error(err)
            reject(err)
        }
        resolve(result.rows)
    })
})

module.exports = {
    databaseView,
    databaseInput
}

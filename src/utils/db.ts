export {}
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 2500,
    idleTimeoutMillis: 2000,
    max: 10000
})

const databaseInput = (value) => new Promise((resolve, reject) => {
    pool.query(value, (err, result) => {
        if (err) {
            console.error(err)
            reject(err)
        }
        resolve(result)
    })
})

const databaseView = (value) => new Promise((resolve, reject) => {
    pool.query(value, (err, result) => {
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

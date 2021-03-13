/*
 * This file is part of the KryPtoN Bot WA distribution (https://github.com/Kry9toN/KryPtoN-WhatsApp-Bot).
 * Copyright (c) 2021 Dhimas Bagus Prayoga.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import { Pool } from 'pg'
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
    max: 10000,
    ssl: true
}
const pool = new Pool(process.platform == 'android' ? optionsAndoid : options)

export const databaseInput = (value: string) => new Promise((resolve, reject) => {
    pool.query(value, (err: any, result: any) => {
        if (err) {
            console.error(err)
            reject(err)
        }
        resolve(result)
    })
})

export const databaseView = (value: string) => new Promise((resolve, reject) => {
    pool.query(value, (err: any, result: any) => {
        if (err) {
            console.error(err)
            reject(err)
        }
        resolve(result.rows)
    })
})

export const dbLocale = (id: any) => new Promise((resolve, reject) => {
    pool.query('SELECT * FROM locales', (err: any, result: any) => {
        if (err) {
            console.error(err)
            reject(err)
        }
        let defLocal = 'en'
        const rows = result.rows
        const isInclude = JSON.stringify(rows).includes(id)
        if (rows.length == 0) {
            resolve(defLocal)
        } else if (!isInclude) {
            resolve(defLocal)
        } else {
            for (const lang of rows) {
                if (lang.id == id || lang.id.includes(id)) {
                    defLocal = lang.locale
                    resolve(defLocal)
                }
            }
        }
    })
})

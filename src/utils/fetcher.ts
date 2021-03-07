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

import fetch from 'node-fetch'
import fs from 'fs'

export const getBase64 = async (url: string) => {
    const response = await fetch(url, { headers: { 'User-Agent': 'okhttp/4.5.0' } })
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    const buffer = await response.buffer()
    const videoBase64 = `data:${response.headers.get('content-type')};base64,` + buffer.toString('base64')
    if (buffer) { return videoBase64 }
}

export const fetchJson = (url: string, options: any) => new Promise((resolve, reject) => {
    fetch(url, options)
        .then((response: any) => response.json())
        .then((json) => {
            // console.log(json)
            resolve(json)
        })
        .catch((err: string) => {
            reject(err)
        })
})

export const fetchText = (url: string, options: any) => new Promise((resolve, reject) => {
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

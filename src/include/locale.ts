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

export {}
const i18n = require('i18n')
const path = require('path')

i18n.configure({
    locales: ['en', 'id'],
    directory: path.join(__dirname, '../../locales'),
    defaultLocale: 'en',
    objectNotation: true,
    register: global,

    logWarnFn: function (msg: string) {
        console.log('[INFO]', msg)
    },

    logErrorFn: function (msg: string) {
        console.log('[INFO]', msg)
    },

    missingKeyFn: function (locale: string, value: string) {
        return value
    },

    mustacheConfig: {
        tags: ['{{', '}}'],
        disable: false
    }
})

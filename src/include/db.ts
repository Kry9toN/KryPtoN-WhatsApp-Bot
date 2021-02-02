const { databaseInput } = require('../utils/db')

/***
     * Initial Database
    **/
// Black List
databaseInput('CREATE TABLE IF NOT EXISTS blacklist( id VARCHAR(30) PRIMARY KEY NOT NULL , reason CHAR(225) DEFAULT \'No Reason\')')
    .catch((err: string) => console.log(err))
    // Filters
databaseInput('CREATE TABLE IF NOT EXISTS filters( gid VARCHAR(50) NOT NULL , key VARCHAR(225) NOT NULL, res VARCHAR(225) NOT NULL )')
    .catch((err: string) => console.log(err))
    // Notes
databaseInput('CREATE TABLE IF NOT EXISTS notes( gid VARCHAR(50) NOT NULL , key VARCHAR(225) NOT NULL, res VARCHAR(225) NOT NULL )')
    .catch((err: string) => console.log(err))
    // Premium
databaseInput('CREATE TABLE IF NOT EXISTS gmium( gid VARCHAR(50) PRIMARY KEY NOT NULL, lifetime VARCHAR(10) NOT NULL, signature VARCHAR(30) NOT NULL, waktu TIMESTAMP NOT NULL DEFAULT now() )')
    .catch((err: string) => console.log(err))
databaseInput('CREATE TABLE IF NOT EXISTS pmium( uid VARCHAR(50) PRIMARY KEY NOT NULL, waktu TIMESTAMP NOT NULL DEFAULT now() )')
    .catch((err: string) => console.log(err))
    // Blacklist text
databaseInput('CREATE TABLE IF NOT EXISTS bllist( gid VARCHAR(50) NOT NULL , text VARCHAR(225) NOT NULL)')
    .catch((err: string) => console.log(err))
    // Blacklist user
databaseInput('CREATE TABLE IF NOT EXISTS warn( gid VARCHAR(50) NOT NULL, uid VARCHAR(30) NOT NULL , warn VARCHAR(100) NOT NULL)')
    .catch((err: string) => console.log(err))
    // Sudo
databaseInput('CREATE TABLE IF NOT EXISTS sudo( id VARCHAR(30) PRIMARY KEY NOT NULL )')
    .catch((err: string) => console.log(err))
    // Sudo
databaseInput('CREATE TABLE IF NOT EXISTS afks( uid VARCHAR(30) PRIMARY KEY NOT NULL, afk VARCHAR(10) NOT NULL, reason CHAR(225) NOT NULL, timestart VARCHAR(100) NOT NULL )')
    .catch((err: string) => console.log(err))
    // Locales
databaseInput('CREATE TABLE IF NOT EXISTS locales( id VARCHAR(30) PRIMARY KEY NOT NULL, locale VARCHAR(10) NOT NULL)')
    .catch((err: string) => console.log(err))

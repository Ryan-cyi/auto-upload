#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const colors = require('colors');
const file = path.resolve('upload.json');
const execute = require('./exec')

if (!fs.existsSync(file)) {
    console.error(colors.red('\nOops, did you forget to create config file "upload.json"\n'));
    process.exit(1);
}

const { email_config } = JSON.parse(fs.readFileSync(file));

const { host, port, auth_user, to, auth_pd } = email_config

function validateKey(key) {
    if (!key) {
        console.error(colors.red(`Oops, need email config ${key}!`));
        process.exit(1);
    }
}

validateKey(host)
validateKey(port)
validateKey(auth_user)
validateKey(to)

if (!auth_pd) {
    const findEmailPasswordCmd = `security -q find-generic-password -a ${auth_user} -s email_password -w`
    execute(findEmailPasswordCmd).then(console.log)
} else {
    console.log(auth_pd)
}
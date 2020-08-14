#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const minimist = require('minimist');
const colors = require('colors');

const args = minimist(process.argv.slice(2));
var nodemailer = require('nodemailer');
const file = path.resolve('upload.json');

if (!fs.existsSync(file)) {
    console.error(colors.red('\nOops, did you forget to create config file "upload.json"\n'));
    process.exit(1);
}

const { email_config } = JSON.parse(fs.readFileSync(file));

const results = args._.map(i => {
    const result = JSON.parse(i)
    return result.data
})

const { host, port, auth_user, auth_pd, from, to, cc, copyright } = email_config

if (!host || !port || !auth_user || !auth_pd || !to) {
    console.error(colors.red('\nOops, need email config host, port, auth_user, auth_pd, to infomation "\n'));
    process.exit(1);
}

const generateContent = () => {
    let context = ''
    results.forEach(app => {
        context += `
        <div style="flex:1; padding: 20px" >
            <p>App Name: ${app.buildName}</p>
            <p>Platform: ${app.buildType === "1" ? "iOS" : "Android"} </p>
            <p>Build Version: ${app.buildVersion}</p>
            <p>Build Number: ${app.buildVersionNo} </p>
            <p>Build Created: ${app.buildCreated}</p>
            <div>Update Description:<p style="padding:4px" >${app.buildUpdateDescription}</p> </div></br>
            <p><img width="150" height="150" src="${app.buildQRCodeURL}" /></p>
        </div>
        `
    })
    const st = `
        <did style="display: flex; flex-direction:row" >
            ${context}
        </div>
    `
    return st
}


let appGroupName = results[0] && results[0].buildName

var mailTitle = appGroupName + ' The latest test package has been uploaded to the internal test distribution hosting platform';




function sendSSLMail(mailContent) {
    const html = `
        <body style="padding: 20px; backgroundColor: #aaa" >
            ${mailContent}
            ${copyright}
        </body>
    `
    const stransporter = nodemailer.createTransport({
        host,
        secureConnection: true, // use SSL
        port, // port
        auth: {
            user: auth_user,
            pass: auth_pd,
        },
    });

    function ssl() {
        const mailOptions = {
            from: auth_user,
            to,
            cc,
            subject: mailTitle,
            html: html
        };

        return mailOptions;
    }

    stransporter.sendMail(ssl(), function (error, info) {
        if (error) {
            console.log('error', error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
}

sendSSLMail(generateContent())


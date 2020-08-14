var exec = require('child_process').exec;
async function execute(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.error(error);
                reject(error)
            }
            else {
                resolve(stdout)
            }
        });
    })
}

const apiKey = 'e8c41238cb516e38e61f9984d4d3bcc5'
const apiGroupKey = 'af66ccd37b2db431d823f0f10abcd15d'
const pgy_group_host = 'https://www.pgyer.com/apiv2/appGroup/view'

const cmd = `curl \
--form "appGroupKey=${apiGroupKey}" \
--form "_api_key=${apiKey}" \
${pgy_group_host}`

execute(cmd).then(console.log)


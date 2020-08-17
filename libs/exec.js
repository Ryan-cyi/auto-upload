var exec = require('child_process').exec;
function execute(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, function (error, stdout, stderr) {
            if (error) {
                reject(error)
            }
            else {
                resolve(stdout)
            }
        });
    })
}

module.exports = execute

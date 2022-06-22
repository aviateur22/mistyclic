/** configuration des logs  */
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'ctoutweb',
    streams: [
        {
            level: 'error',
            path: './log/error.log',
            type: 'rotating-file',
            period: '1d',
            count: 4,
        }
    ]
});
module.exports = logger;
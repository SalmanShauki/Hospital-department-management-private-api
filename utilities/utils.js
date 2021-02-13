const Logger = require('./Logger');
const randomstring = require('randomstring');

module.exports.randomGUID = () => {
    Logger.log('info', 'Generating a random string.');
    return randomstring.generate();
};

module.exports.dateToString = (date) => {
    Logger.log('info', 'Converting date to string Format.');
    let updatedDate = date.toString();
    return updatedDate;
};
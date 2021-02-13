const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  const Logger = createLogger({
    format: combine(
      timestamp(),
      myFormat
    ),
    transports: [new transports.Console()]
  });

  module.exports = Logger;
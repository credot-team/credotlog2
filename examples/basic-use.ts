import credotlog from '../';

const logger = credotlog.create({
  consoleLogLevel: 'info',
  maxSize: '100m',
  maxDay: 14,
  graylog: {
    level: 'err',
    server: { host: 'https://graylog.credot.ml/', port: 1234 },
    hostname: 'credotlog-test',
  },
  exceptionLevel: 'debug',
  filenameDateFormat: 'YYYYMMDDHH'
});

credotlog.addLevelFontStyles({
  error: 'bold red yellowBG',
  info: 'blue',
  debug: 'whiteBG black',
});

logger.info('asd');

logger.err('hello world', {
  _data: 'dust',
  trace: { a: 1, b: 5 },
  short_message: 'hidden message',
});

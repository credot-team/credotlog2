import credotlog from '../';
import express from 'express';
import * as http from 'http';

const logger = credotlog.create({
  consoleLogLevel: 'info',
  infoOut: './logs/log.log',
  errorOut: './logs/error.log',
  graylog: {
    level: 'warning',
    server: { host: 'https://graylog.credot.ml/', port: 443 },
    hostname: 'credotlog-test',
  },
  exceptionLevel: 'debug',
});

const app = express();

app.use(credotlog.express.logging({ logger: logger }));

app.all('/test', (req, res) => {
  res.json({ errorCode: 0, errorMessage: 'success' });
  res.end();
});

app.all('/test-400', (req, res) => {
  res.status(400).end();
});

app.all('/test-500', (req, res) => {
  res.status(500).end();
});

app.all('/test-error', (req, res) => {
  res.json({ errorCode: 1005, errorMessage: 'test error' });
  res.end();
});

app.all('/log/:level', (req, res) => {
  const level = req.params.level;
  // @ts-ignore
  logger.log(level, 'test message');
  res.end();
});

http.createServer(app).listen(8880, () => {
  console.log('server on');
});

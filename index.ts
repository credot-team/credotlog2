import axios from 'axios';
import chalk from 'chalk';

let graylogURL = '';
let host = '';

export const init = (protocol: string, urlHost: string, serviceName: string) => {
  const url = new URL('http://w');
  url.protocol = protocol;
  url.host = urlHost;
  url.pathname = 'gelf';
  graylogURL = url.toString();
  host = serviceName;
  colorlog(`graylog init: ${JSON.stringify({ graylogURL, host })}`, 'info');
};

// https://en.wikipedia.org/wiki/Syslog#cite_note-opengroupSyslog-8
const levelMap = new Map();
levelMap.set('Emerg', 0);
levelMap.set('Alert', 1);
levelMap.set('Crit', 2);
levelMap.set('Err', 3);
levelMap.set('Warning', 4);
levelMap.set('Notice', 5);
levelMap.set('Info', 6);
levelMap.set('Debug', 7);

/**
 * sfslfms;dfmskdfm;sdmf
 * @param {string} level hshdhdoshdlodklds
 * @param {string} message fdsfldsl
 * @param {object} others
 * @param {property} others.host
 * @returns {Promise<void>}
 */
export const log = async (
  level: 'Emerg' | 'Alert' | 'Crit' | 'Err' | 'Warning' | 'Notice' | 'Info' | 'Debug',
  message: string,
  others?: object,
) => {
  let l = levelMap.get(level);
  levellog(`${message} ${JSON.stringify(others)}`, l);

  let body = {
    host,
    level: l,
    short_message: message,
    ...others,
  };
  try {
    let result = await axios.post(graylogURL, body);
    if (result.status !== 202) {
      throw new Error(`send graylog data: ${JSON.stringify(result.config.data)}`);
    }
  } catch (error) {
    console.log('send graylog fail, error: ', error.message);
  }
};

type colors = 'black' | 'info' | 'success' | 'warning' | 'error' | 'debug';

export const colorlog = (message: string, color: colors = 'black') => {
  switch (color) {
    case 'success':
      console.log(chalk.greenBright(message));
      break;
    case 'info':
      console.log(chalk.cyanBright(message));
      break;
    case 'error':
      console.log(chalk.redBright(message));
      break;
    case 'warning':
      console.log(chalk.yellow(message));
      break;
    case 'debug':
      console.log(chalk.dim(message));
      break;
    default:
      console.log(message);
  }
};

export const levellog = (message: string, level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) => {
  switch (level) {
    case 7:
      console.log(chalk.magentaBright(message));
      break;
    case 6:
      console.log(chalk.dim(message));
      break;
    case 5 | 4:
      console.log(chalk.yellow(message));
      break;
    default:
      console.log(chalk.redBright(message));
      break;
  }
};

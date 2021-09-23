import Transport from 'winston-transport';
import jsonStringify from 'safe-stable-stringify';
import { LogLevels, syslog } from '../logLevels';
import { URL } from 'url';
import axios from 'axios';

interface GraylogTransportOptions extends Transport.TransportStreamOptions {
  graylog: {
    server: {
      host: string;
      port?: number;
    };
    hostname: string;
  };
  levels: LogLevels;
  levelMap: { [p in keyof typeof syslog.levels]: string };
  staticMeta?: object;
}

export class GraylogTransport extends Transport {
  private static readonly VERSION = '1.1';
  private static readonly API_PATH = 'gelf';
  private static readonly OVERRIDEABLE_PAYLOAD = ['full_message', 'short_message'];

  private readonly hostname: string;
  private readonly levelNumberMapping: { [p: string]: number };
  private gelfUrl: string;
  private staticMeta?: object;

  constructor(opts: GraylogTransportOptions) {
    super(opts);

    this.silent = opts.silent ?? false;

    const server = opts.graylog.server;
    const gelfUrl = new URL(server.host);
    if (server.port) gelfUrl.port = server.port.toString();
    gelfUrl.pathname = GraylogTransport.API_PATH;

    this.gelfUrl = gelfUrl.toString();
    this.hostname = opts.graylog.hostname;
    this.staticMeta = opts.staticMeta;

    this.levelNumberMapping = {};
    Object.entries(opts.levelMap).forEach(([name, alias]) => {
      this.levelNumberMapping[alias] = (syslog.levels as LogLevels)[name];
    });
  }

  log(info: any, callback?: (err: Error | undefined) => void): any {
    const { message, level, metadata, ...restInfo } = info as { message: string; [p: string]: any };
    const additionFields: any = {};

    Object.entries({ ...this.staticMeta, ...metadata, ...restInfo }).forEach(([key, value]) => {
      if (GraylogTransport.OVERRIDEABLE_PAYLOAD.includes(key)) {
        additionFields[key] = value;
        return;
      }
      if (!additionFields._data) additionFields._data = {};
      additionFields._data[key] = value;
    });

    let eol = message.indexOf('\n'); //end of line
    const firstLine = eol >= 0 ? message.slice(0, eol) : message;
    const shortMessage = firstLine.length > 100 ? firstLine.slice(0, 100) : firstLine;

    const payload = {
      version: GraylogTransport.VERSION,
      timestamp: Math.trunc(Date.now() * 1e-3),
      level: this.levelNumberMapping[level],
      host: this.hostname,
      short_message: shortMessage,
      full_message: message,
      ...additionFields,
    };

    axios
      .post(this.gelfUrl, payload, { timeout: 1000 })
      .then((result) => {
        if (result.status !== 202) throw new Error(`response status: ${result.status};`);

        this.emit('logged', info);
        callback?.(undefined);
      })
      .catch((e: Error) => {
        const error = new Error(
          `send graylog failed: ${e.message}; payload: ${jsonStringify(payload)};`,
        );
        this.emit('warn', error);
        callback?.(undefined);
      });
    return true;
  }
}

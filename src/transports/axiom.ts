import Transport from 'winston-transport';
import jsonStringify from 'safe-stable-stringify';
import { LogLevels, syslog } from '../logLevels';
import { URL } from 'url';
import axios, { AxiosInstance } from 'axios';

interface AxiomTransportOptions extends Transport.TransportStreamOptions {
  axiom: {
    env: string;
    apiToken: string;
    service: string;
  };

  levels: LogLevels;
  levelMap: { [p in keyof typeof syslog.levels]: string };
  staticMeta?: object;
}

export class AxiomTransport extends Transport {
  private static readonly OVERRIDEABLE_PAYLOAD = ['full_message', 'short_message'];

  private readonly levelNumberMapping: { [p: string]: number };
  private staticMeta?: object;

  private instance: AxiosInstance;
  private service: string;

  constructor(opts: AxiomTransportOptions) {
    super(opts);

    this.instance = axios.create({
      baseURL: `https://cloud.axiom.co/api/v1/datasets/${opts.axiom.env}/ingest`,
      headers: {
        Authorization: 'Bearer ' + opts.axiom.apiToken,
        'Content-Type': 'application/x-ndjson',
      },
    });
    this.service = opts.axiom.service;

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
      if (AxiomTransport.OVERRIDEABLE_PAYLOAD.includes(key)) {
        additionFields[key] = value;
        return;
      }
      if (!additionFields._data) additionFields._data = {};
      additionFields._data[key] = value;
    });

    const payload = {
      service: this.service,
      level: level === 'err' ? 'error' : level,
      message,
      data: { ...additionFields },
    };

    this.instance
      .post('', payload)
      .then((result) => {
        if (result.status !== 200) throw new Error(`response status: ${result.status};`);

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

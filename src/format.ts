import { format as logFormat } from 'logform';

export namespace format {
  export const timestamp = logFormat((info) => {
    info.message = `[${new Date().toISOString()}] ${info.message}`;
    return info;
  });

  export const errors = logFormat((info) => {
    if (!(info.exception && info.error)) return info;
    info.message = info.error.stack;
    return {
      level: info.level,
      message: info.message,
      [Symbol.for('level')]: info.level,
      [Symbol.for('message')]: info.message,
    };
  });

  export const debugInfo = logFormat((info) => {
    console.log('[winston] format debugger: ', info);
    return info;
  });
}

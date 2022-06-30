# credotlog

## Quick Start

在 `./examples/` 目錄中可以找到使用範例

## Usage

```js
import credotlog from '../';

// 建立 logger 物件
const logger = credotlog.create({
  //
  // - 將 'info' 及更高級別的 log 記錄到 console
  // - 將與 'info' 對應的等級，以及更高級別的 log 記錄到檔案 './logs/log.%DATE%.log' (%DATE% 為日期，將由程式自動插入)
  // - 將與 'err' 對應的等級，以及更高級別的 log 記錄到檔案 './logs/error.%DATE%.log' (%DATE% 為日期，將由程式自動插入)
  // - 將與 'debug' 對應的等級，以及更高級別的 log 記錄到檔案 './logs/debug.%DATE%.log' (%DATE% 為日期，將由程式自動插入)
  //
  consoleLogLevel: 'info',
  infoOut: './logs/log.log',
  errorOut: './logs/error.log',
  debugOut: './logs/debug.log',
  //
  // - 將單一檔案最大容量設為 '100MB'
  // - 最多保留 14天 的紀錄
  //
  maxSize: '100m',
  maxDay: 14,
  //
  // 將 'warning' 及更高級別的 log 記錄到 graylog
  // 指定 graylog domain 為 'https://graylog.credot.ml/'
  // 指定訊息來源為 'my-awesome-app' (等同 graylog 的 source)
  //
  graylog: {
    level: 'warning',
    server: { host: 'https://graylog.credot.ml/' },
    hostname: 'my-awesome-app',
  },

  //
  // axiom範例寫法
  // 注意axiom只會標記level為warning及error的紀錄
  //
  axiomlog: {
    level: 'info',
    env: process.env.NODE_ENV, // 服務環境: development || beta || production
    apiToken: process.env.DEV_TOKEN, // 環境的apiToken
    service: 'test_service', // 服務名稱
  },

  //
  // 當 uncaughtException 發生時，以 'crit' 等級做 log
  //
  exceptionLevel: 'crit',
});

//
// 以上 logger 將產生三個檔案，假設當前日期為 2021-09-27 16:30:00
// - './logs/log.0927.log'
// - './logs/error.0927.log'
// - './logs/debug.0927.log'
//

// 以 'debug' 等級紀錄訊息
logger.log('debug', 'a debug message');

// 以 'info' 等級紀錄訊息
// 等效於 logger.log('info', 'server on')
logger.info('server on');

// 以 'err' 等級紀錄訊息並帶有額外資訊
// 等效於 logger.log('err', 'database update error', { table: 'user', action: 'insert' })
logger.err('database update error', {
  table: 'user',
  action: 'insert',
});
```

## Logging levels

預設的 logging levels 為 [RFC5424] 定義的 `syslog` 等級

數字越小，級別越高，在此例中 `emerg` 為最高級別的訊息

```js
const levels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  err: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
};
```

## Create options

建立 logger 時接受兩個參數，分別為 `Options` 及 `Levels`

### Options: 定義 logger 的行為

| 名稱               | 型別   | 必填 | 描述                                                                                                  |
| ------------------ | ------ | ---- | ----------------------------------------------------------------------------------------------------- |
| consoleLogLevel    | string | 否   | 將等級等於或高於此值的訊息輸出至 console 。不指定表示不輸出至 console。                               |
| infoOut            | string | 否   | 將對應等級等於或高於 'info' 的訊息輸出至此路徑的檔案。不指定表示不輸出。                              |
| errorOut           | string | 否   | 將對應等級等於或高於 'err' 的訊息輸出至此路徑的檔案。不指定表示不輸出。                               |
| debugOut           | string | 否   | 將對應等級等於或高於 'debug' 的訊息輸出至此路徑的檔案。不指定表示不輸出。                             |
| filenameDateFormat | string | 否   | 指定檔名中的日期格式。(預設: 'MMDD')                                                                  |
| maxSize            | string | 否   | 單一檔案大小限制，格式為 '\[數量\]\[單位\]'，不指定表示不限制。ex. 100k (100KB), 10m (10MB), 1g (1GB) |
| maxDay             | number | 否   | 限制 log 檔最大天數，當 log 檔案超過此限制時會由最舊的檔案開始刪除。不指定表示不限制。                |
| graylog            | object | 否   | 設定 Graylog 環境，不指定表示不輸出至 Graylog。                                                       |
| axiom              | object | 否   | 設定 Axiom 環境，不指定表示不輸出至 Axiom。                                                           |
| exceptionLevel     | string | 否   | 指定發生未捕捉例外時，要以何種 level 來記錄錯誤。不指定表示不監聽未捕捉例外。                         |
| levelMapping       | object | 否   | 指定 level 對應表。當自定義的 logging levels 中不存在與 syslog 對應的 level 時，此項為必填            |

- #### graylog: 設定 Graylog 環境

  | 名稱     | 型別   | 必填 | 描述                                                                                  |
  | -------- | ------ | ---- | ------------------------------------------------------------------------------------- |
  | level    | string | 是   | 將等級等於或高於此值的訊息輸出至 Graylog 。                                           |
  | hostname | string | 是   | 本機名稱 (會被作為 source)                                                            |
  | server   | object | 是   | Graylog 服務位址。 ex. `{ host: 'https://my.graylog.net/', port: 443 }` (port 為可選) |

- #### axiom: 設定 Axiom 環境
  | 名稱     | 型別   | 必填 | 描述                                                  |
  | -------- | ------ | ---- | ----------------------------------------------------- |
  | env      | string | 是   | 服務環境: development &vert; beta &vert; production。 |
  | apiToken | string | 是   | 環境的 apiToken                                       |
  | service  | string | 是   | 服務名稱                                              |

### Levels: 自定義 logging levels

當 `syslog` 定義的級別不符合專案的需求時可以提供自定義的級別設定

自訂的級別無法與 `syslog` 完全對照時，必須提供 `levelMapping` 指定自訂級別與 syslog 的對應關係

```js
const logger = credotlog.create(
  {
    consoleLogLevel: 'info',
    infoOut: './logs/log.log',
    levelMapping: {
      emerg: 'die',
      alert: 'danger',
      crit: 'danger',
      err: 'danger',
      warning: 'normal',
      notice: 'normal',
      info: 'normal',
    },
  },
  {
    die: 0,
    danger: 1,
    normal: 2,
    debug: 3,
  },
);
```

#### ex.

```json
{
  "error": 0,
  "warn": 1,
  "info": 2,
  "http": 3,
  "verbose": 4,
  "debug": 5,
  "silly": 6
}
```

### 自訂檔案日期格式

建立 logger 時可以自訂輸出檔案的名稱中日期的格式。(預設: 'MMDD')

```js
const logger = credotlog.create({
  consoleLogLevel: 'info',
  infoOut: './logs/log.log',
  filenameDateFormat: 'YYYYMMDDHH',
});

logger.info('write into file');
//
// 設當前時間為 2021-09-27 16:30:00
// 訊息將輸出至 ./logs/log.2021092716.log
//
```

## Express middleware

適用於 [express] 的 middleware，用於紀錄 HTTP 請求與回應

**_不建議與 [morgan] 一同使用_**

### Usage

```js
import credotlog from '../';
import express from 'express';
import * as http from 'http';

const logger = credotlog.create({
  consoleLogLevel: 'info',
  infoOut: './logs/log.log',
});

const app = express();

// 建立 middleware 須提供 logger，middleware 將使用給定的 logger 做紀錄
app.use(credotlog.express.logging({ logger: logger }));

app.all('/test', (req, res) => {
  res.json({ errorCode: 0, errorMessage: 'success' });
  res.end();
});

http.createServer(app).listen(8880, () => {
  console.log('server on');
});

//
// 輸出
// info: [2021-09-27T09:11:36.343Z] HTTP GET /test 200 2.130 40 {"errorCode":0,"errorMessage":"success"}
// HTTP {method} {path} {status} {cost-time} {content-length?} {json-data?}
// json-data: 預設 formatter 只輸出 errorCode, errorMessage
//
```

### 自訂輸出格式

建立 middleware 時可以提供自定義的 `formatter` 來自定義輸出訊息

以下是系統預設的 `formatter` 範例

```js
credotlog.express.logging({
  logger: logger,
  formatter: (info, args) => {
    // 當 status !== 200 或沒有 json 回傳時不做額外處理
    if (!(args.statusCode === 200 && args.jsonBody)) return info;

    // 將 errorCode, errorMessage 插入訊息結尾
    const { errorCode, errorMessage } = args.jsonBody;
    info.message = `${info.message} ${jsonStringify({ errorCode, errorMessage })}`;

    // 若 errorCode > 0 將訊息 level 改為 notice (level 請使用 'info' | 'notice' | 'warning' | 'err')
    if (errorCode > 0) info.level = 'notice';
    return info;
  },
});
```

### 自訂訊息等級對應表

`express.middleware` 使用將訊息定義為以下種類 'info', 'notice', 'warning', 'err'，
若 logger 中使用的自定義 levels 無法與以上的種類對應，則需要自行指定訊息等級對照表。

```js
const logger = credotlog.create(
  {
    consoleLogLevel: 'info',
    infoOut: './logs/log.log',
    levelMapping: {
      emerg: 'die',
      alert: 'danger',
      crit: 'danger',
      err: 'danger',
      warning: 'normal',
      notice: 'normal',
      info: 'normal',
    },
  },
  {
    die: 0,
    danger: 1,
    normal: 2,
    debug: 3,
  },
);

const app = express();

// 根據 logger 中的 levels 定義 levelMap
app.use(
  credotlog.express.logging({
    logger: logger,
    levelMap: {
      err: 'die',
      warn: 'danger',
      notice: 'normal',
      info: 'debug',
    },
  }),
);
```

#### Author: [Credot]

[credot]: https://github.com/credot-team
[rfc5424]: https://tools.ietf.org/html/rfc5424
[express]: https://www.npmjs.com/package/express
[morgan]: https://www.npmjs.com/package/morgan

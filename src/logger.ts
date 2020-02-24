import * as pino from 'pino';

export default pino({
  prettyPrint: { colorize: true, translateTime: 'SYS:standard' },
});

export const DEFAULT_MDSRV_HOSTNAME: string = 'localhost';
export const DEFAULT_MDSRV_PORT: number = 5644;

export enum Destination {
  NONE = 'none',
  DISCORD = 'discord',
}

export enum Status {
  INFO = 'info',
  LOG = 'log',
  DEBUG = 'debug',
  WARN = 'warn',
  ERROR = 'error',
}

export * from './message';
export * from './client';

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

export interface Message {
  source: string;
  sourceId: string;
  dest: string;
  destId: string;
  status: string;
  value: string;
  created: string;
}

/**
 * Create a new message.
 *
 * @param {string} source - Source of the message
 * @param {string} sourceId - More precise identifier for the source
 * @param {Destination} dest - Destination or service to send to
 * @param {string} destId - More precise destination identifier
 * @param {Status} status - 'error', 'info', etc.
 * @param {string} value - Message data/text
 * @param {string} created - Optional: Date timestamp in ISO format
 */
export function newMessage(
  source: string,
  sourceId: string,
  dest: Destination,
  destId: string,
  status: Status,
  value: string,
  created?: string,
): Message {
  if (!created || created === '') {
    created = new Date(Date.now()).toISOString();
  }

  return {
    source: source,
    sourceId: sourceId,
    dest: dest,
    destId: destId,
    status: status,
    value: value,
    created: created,
  };
}

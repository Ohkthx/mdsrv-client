import axios, {AxiosError} from 'axios';
import {config as envLoad} from 'dotenv';
import {Message} from './message';

const DEFAULT_REST_HOSTNAME: string = 'localhost';
const DEFAULT_REST_PORT: number = 5644;

// Load the environment variables into process.env
envLoad();

// Get the HOSTNAME and PORT to create the URI.
const HOSTNAME = process.env.MDSRV_HOSTNAME ?? DEFAULT_REST_HOSTNAME;
let PORT = parseInt(process.env.MDSRV_PORT ?? '');
if (isNaN(PORT)) {
  PORT = DEFAULT_REST_PORT;
  console.error(
    `'DEFAULT_REST_PORT' is not set in '.env' file, using port '${PORT}'`,
  );
}

// Set the target URI.
const ENV_REST_URI: string = `http://${HOSTNAME}:${PORT}/`;

/**
 * Send a message to the distributor.
 *
 * @param {Message} message - Message to be distributed.
 */
export async function sendMessage(message: Message) {
  try {
    const response = await axios.post<Message>(ENV_REST_URI, message);
    return response.data;
  } catch (error) {
    if ((error as AxiosError)?.response?.status === 404) {
      throw new Error(`invalid uri '${ENV_REST_URI}', received 404.`);
    }

    throw new Error(`could not access '${ENV_REST_URI}'`);
  }
}

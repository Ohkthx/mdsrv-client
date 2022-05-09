import {DEFAULT_MDSRV_HOSTNAME, DEFAULT_MDSRV_PORT, Message} from '.';
import axios, {AxiosError, AxiosInstance} from 'axios';
import axiosRetry, {isNetworkOrIdempotentRequestError} from 'axios-retry';
import {config as envLoad} from 'dotenv';

// Load the environment variables into process.env
envLoad();

// Get the HOSTNAME and PORT to create the URI.
const HOSTNAME = process.env.MDSRV_HOSTNAME ?? DEFAULT_MDSRV_HOSTNAME;
let PORT = parseInt(process.env.MDSRV_PORT ?? '');
if (isNaN(PORT)) {
  PORT = DEFAULT_MDSRV_PORT;
  console.error(`'MDSRV_PORT' is not set in '.env' file, using port '${PORT}'`);
}

// Set the target URI.
const MDSRV_REST_URL: string = `http://${HOSTNAME}:${PORT}/`;

function getErrorMessage(error: AxiosError): string {
  const responseWithErrorMessage = error as AxiosError<{message: string}>;
  return responseWithErrorMessage.response?.data.message || error.message;
}

export class MDSRVClient {
  private readonly baseURL: string;
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.baseURL = MDSRV_REST_URL;
    this.httpClient = axios.create({baseURL: MDSRV_REST_URL, timeout: 50_000});

    axiosRetry(this.httpClient, {
      retries: Infinity,
      retryCondition: (error: AxiosError) => {
        return isNetworkOrIdempotentRequestError(error);
      },
      retryDelay: (_retryCount: number, error: AxiosError) => {
        const errorMessage = getErrorMessage(error);
        console.error(
          `Could not get resource "${error.config.baseURL}${error.config.url}": ` +
            `${errorMessage}`,
        );
        return 1000;
      },
      shouldResetTimeout: true,
    });
  }

  /**
   * Send a message to the distributor.
   *
   * @param {Message} message - Message to be distributed.
   */
  async sendMessage(message: Message) {
    const response = await this.httpClient.post<Message>(this.baseURL, message);
    return response.data;
  }
}

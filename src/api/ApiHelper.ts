import axios, {AxiosRequestConfig} from "axios";

const ENABLE_API = import.meta.env.VITE_ENABLE_API === "true";
const DELAY_MS = 500;

const delay = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS));

export class ApiHelper {
  async request<T>(
    config: AxiosRequestConfig,
    mock: () => Promise<T> | T
  ): Promise<T> {
    if (!ENABLE_API) {
      console.log("[DEV] Mock request:", config.url);
      await delay();
      return await mock();
    }

    const res = await axios(config);
    return res.data;
  }
}

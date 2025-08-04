import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from '@utils/constant';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  error => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  error => Promise.reject(error),
);

interface ClientParams {
  method?: string;
  url: string;
  data?: any;
  headers?: Record<string, string>;
  [key: string]: any;
}

const client = ({
  method = 'get',
  url,
  data,
  headers = {},
  ...otherParams
}: ClientParams) => {
  return api({
    method,
    url,
    data,
    headers,
    ...otherParams,
  });
};

export default client;

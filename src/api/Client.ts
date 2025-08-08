import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from '@utils/constant';
import { showError } from '@utils/toast';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },

  error => {
    const status = error?.response?.status;
    const errorData = error?.response?.data;

    if (status >= 400 && status < 410) {
      showError(errorData?.error);
    } else {
      showError('Something went wrong');
    }

    return error;
  },
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

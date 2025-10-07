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
    console.log('status: ', status);
    const errorData = error?.response?.data;
    console.log('errorData: ', errorData);
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

// import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// import * as Sentry from '@sentry/react-native';
// import { BASE_URL } from '@utils/constant';
// import { showError } from '@utils/toast';

// // Create axios instance
// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // Request interceptor (start Sentry span)
// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const method = (config.method || 'GET').toUpperCase();
//     const url = `${config.baseURL || ''}${config.url || ''}`;

//     // Start a span for this API call
//     const span = Sentry.startSpan(
//       {
//         name: `${method} ${config.url}`,
//         op: 'http.client',
//         attributes: {
//           'http.method': method,
//           'http.url': url,
//         },
//       },
//       () => {}, // noop callback, we’ll finish manually later
//     );

//     (config as any)._sentrySpan = span;

//     return config;
//   },
//   error => Promise.reject(error),
// );

// // Response interceptor (finish span)
// api.interceptors.response.use(
//   (response: AxiosResponse) => {
//     const span = (response.config as any)?._sentrySpan;
//     if (span) {
//       span.setAttribute?.('http.status_code', response.status);
//       span.setStatus?.('ok');
//       span.end?.();
//     }
//     return response;
//   },
//   error => {
//     const config = error?.config as any;
//     const span = config?._sentrySpan;

//     if (span) {
//       const status = error?.response?.status;
//       if (status) {
//         span.setAttribute?.('http.status_code', status);
//       }
//       span.setStatus?.('internal_error');
//       span.end?.();
//     }

//     const status = error?.response?.status;
//     const errorData = error?.response?.data;

//     if (status >= 400 && status < 410) {
//       showError(errorData?.error || 'Request failed');
//     } else {
//       showError('Something went wrong');
//     }

//     // Report error to Sentry
//     Sentry.captureException(error);

//     return Promise.reject(error);
//   },
// );

// interface ClientParams {
//   method?: string;
//   url: string;
//   data?: any;
//   headers?: Record<string, string>;
//   [key: string]: any;
// }

// // Client wrapper (kept same as your old code)
// const client = ({
//   method = 'get',
//   url,
//   data,
//   headers = {},
//   ...otherParams
// }: ClientParams) => {
//   return api({
//     method,
//     url,
//     data,
//     headers,
//     ...otherParams,
//   });
// };

export default client;

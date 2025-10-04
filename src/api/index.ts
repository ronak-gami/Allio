import { newsService } from '../realm/services';
import client from './Client';
import manageGenericReponse from '@utils/apiHelper';

const api = {
  MEDIA: {
    upload: ({ data }: { data: FormData }) =>
      client({
        method: 'post',
        url: '/upload',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),

    getMedia: ({ data }: { data: { email: string; fileType: string } }) =>
      client({
        method: 'post',
        url: '/get-media',
        data,
      }),
  },

  MPIN: {
    sendOtp: ({ data }: { data: { email: string } }) =>
      client({
        method: 'post',
        url: '/user/send-otp',
        data,
      }),

    validateOtp: ({ data }: { data: { email: string; otp: string } }) =>
      client({
        method: 'post',
        url: '/user/validate-otp',
        data,
      }),

    setNewMpin: ({ data }: { data: { email: string; newMpin: string } }) =>
      client({
        method: 'post',
        url: '/user/set-new-mpin',
        data,
      }),
  },

  QRCODE: {
    generate: ({ data }: { data: { email: string } }) =>
      client({
        method: 'post',
        url: 'qrcode/generate',
        data,
      }),
  },

  NOTIFICATION: {
    sendNotification: ({ data }: { data: any }) =>
      client({
        method: 'post',
        url: '/user/send-notification',
        data,
      }),
  },

  AI: {
    getAiResponse: ({ data }: { data: { prompt: string } }) =>
      client({
        method: 'post',
        url: '/ai/gemini',
        data,
      }),
  },

  GETSTREAM: {
    addUser: ({
      data,
    }: {
      data: {
        firstName: string;
        lastName: string;
        email: string;
        mobileNo: string;
      };
    }) =>
      client({
        method: 'post',
        url: '/getstream/add-user-getstream',
        data,
      }),

    getToken: ({ data }: { data: { userId: string } }) =>
      client({
        method: 'post',
        url: '/getstream/get-token',
        data,
      }),
  },

  NEWS: {
    getNews: (forceRefresh = false) =>
      manageGenericReponse({
        method: 'get',
        endpoint: '/news',
        realmService: newsService,
        forceRefresh,
        dataKey: 'data',
        mapToApi: item => ({
          name: item?.name,
          description: item?.description,
          createdAt: item?.createdAt,
        }),
      }),

    addNews: (values: { name: string; description: string }) =>
      manageGenericReponse({
        method: 'post',
        endpoint: '/news',
        realmService: newsService,
        values,
        mapToApi: item => ({
          name: item?.name,
          description: item?.description,
          createdAt: item?.createdAt,
        }),
      }),

    deleteNews: (id: string) =>
      manageGenericReponse({
        method: 'delete',
        endpoint: '/news',
        realmService: newsService,
        id,
      }),

    editNews: (values: { id: string; name: string; description: string }) =>
      manageGenericReponse({
        method: 'put',
        endpoint: '/news',
        realmService: newsService,
        values,
        mapToApi: item => ({
          name: item?.name,
          description: item?.description,
          createdAt: item?.createdAt,
        }),
      }),
  },
};

export default api;

import { newsService } from '../realm/services';
import client from './Client';
import manageGenericReponse from '@utils/apiHelper';

// import {
//   addGenericResponse,
//   deleteGenericResponse,
//   syncAndFetchGeneric,
//   SyncAndFetchParams,
//   editGenericResponse,
// } from '@utils/apiHelper';

// const getGenericResponse = async ({
//   endpoint,
//   realmService,
//   forceRefresh,
//   deletedFlagKey,
//   dataKey,
//   mapToApi,
// }: SyncAndFetchParams) =>
//   syncAndFetchGeneric({
//     endpoint,
//     realmService,
//     deletedFlagKey,
//     forceRefresh,
//     dataKey,
//     mapToApi,
//   });

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

  //  NEWS: {
  //   getNews: (forceRefresh = false) =>
  //     getGenericResponse({
  //       endpoint: '/news',
  //       realmService: newsService,
  //       forceRefresh,
  //       dataKey: 'data',
  //       mapToApi: item => ({
  //         name: item?.name,
  //         description: item?.description,
  //       }),
  //     }),

  //   addNews: (values: {
  //     name: string;
  //     description: string;
  //     imageUrl?: string;
  //   }) =>
  //     addGenericResponse({
  //       endpoint: '/news',
  //       realmService: newsService,
  //       values,
  //       mapToApi: item => ({
  //         name: item?.name,
  //         description: item?.description,
  //       }),
  //     }),

  //   deleteNews: (id: string) =>
  //     deleteGenericResponse({
  //       endpoint: '/news',
  //       realmService: newsService,
  //       id,
  //     }),

  //   editNews: (values: {
  //     name: string;
  //     description: string;
  //     imageUrl?: string;
  //   }) =>
  //     editGenericResponse({
  //       endpoint: '/news',
  //       realmService: newsService,
  //       values,
  //       mapToApi: item => ({
  //         name: item?.name,
  //         description: item?.description,
  //       }),
  //     }),
  // },

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
        }),
      }),

    addNews: (values: {
      name: string;
      description: string;
      imageUrl?: string;
    }) =>
      manageGenericReponse({
        method: 'post',
        endpoint: '/news',
        realmService: newsService,
        values,
        mapToApi: item => ({
          name: item?.name,
          description: item?.description,
        }),
      }),

    deleteNews: (id: string) =>
      manageGenericReponse({
        method: 'delete',
        endpoint: '/news',
        realmService: newsService,
        id,
      }),

    editNews: (values: {
      id: string;
      name: string;
      description: string;
      imageUrl?: string;
    }) =>
      manageGenericReponse({
        method: 'put',
        endpoint: '/news',
        realmService: newsService,
        values,
        mapToApi: item => ({
          name: item?.name,
          description: item?.description,
        }),
      }),
  },
};

export default api;

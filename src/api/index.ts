import client from './Client';

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

  NOTIFICATION: {
    sendNotificatoin: ({
      data,
    }: {
      data: { email: string; title: string; body: string };
    }) =>
      client({
        method: 'post',
        url: '/user/send-notification',
        data,
      }),
  },

  QRCODE: {
    generate: ({ data }: { data: { email: string } }) =>
      client({
        method: 'post',
        url: '/qrcode/generate',
        data,
      }),
  },
};

export default api;

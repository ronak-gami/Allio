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
        url: '/send-otp',
        data,
      }),

    validateOtp: ({ data }: { data: { email: string; otp: string } }) =>
      client({
        method: 'post',
        url: '/validate-otp',
        data,
      }),

    setNewMpin: ({ data }: { data: { email: string; newMpin: string } }) =>
      client({
        method: 'post',
        url: '/set-new-mpin',
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
};

export default api;

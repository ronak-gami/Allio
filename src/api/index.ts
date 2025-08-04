import client from './client';

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
        headers: {
          'Content-Type': 'application/json',
        },
      }),
  },
};

export default api;

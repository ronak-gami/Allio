import api from '@api/index';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface MediaState {
  images: string[];
  videos: string[];
}

const initialState: MediaState = {
  images: [],
  videos: [],
};

// ✅ Fetch Images
export const fetchImages = createAsyncThunk<string[], string>(
  'media/fetchImages',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.MEDIA.getMedia({
        data: { email, fileType: 'image' },
      });
      if (response.data?.success) {
        return response.data.files;
      }
      return rejectWithValue('Failed to fetch images');
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  },
);

// ✅ Fetch Videos
export const fetchVideos = createAsyncThunk<string[], string>(
  'media/fetchVideos',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.MEDIA.getMedia({
        data: { email, fileType: 'video' },
      });
      if (response.data?.success) {
        return response.data.files;
      }
      return rejectWithValue('Failed to fetch videos');
    } catch (error: any) {
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  },
);

// ✅ Upload Media
export const uploadMedia = createAsyncThunk<
  { fileType: 'image' | 'video'; url: string },
  { formData: FormData; fileType: 'image' | 'video' }
>('media/uploadMedia', async ({ formData, fileType }, { rejectWithValue }) => {
  try {
    const response = await api.MEDIA.upload({ data: formData });
    if (response.data?.success) {
      return { fileType, url: response.data.url };
    }
    return rejectWithValue('Upload failed');
  } catch (error: any) {
    return rejectWithValue(error.message || 'An unknown error occurred');
  }
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.images = action.payload;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos = action.payload;
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        const { fileType, url } = action.payload;
        if (fileType === 'image') {
          state.images.push(url);
        } else {
          state.videos.push(url);
        }
      });
  },
});

export default mediaSlice.reducer;

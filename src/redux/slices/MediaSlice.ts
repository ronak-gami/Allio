import api from '@api/index';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MediaState {
  images: string[];
  videos: string[];
}

const initialState: MediaState = {
  images: [],
  videos: [],
};

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

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<string[]>) => {
      state.images = action.payload;
    },
    setVideos: (state, action: PayloadAction<string[]>) => {
      state.videos = action.payload;
    },
    resetMedia: state => {
      state.images = [];
      state.videos = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.images = action.payload;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos = action.payload;
      });
  },
});

export const { setImages, setVideos, resetMedia } = mediaSlice.actions;
export default mediaSlice.reducer;

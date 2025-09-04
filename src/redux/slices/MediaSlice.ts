import api from '@api/index';
import firestore from '@react-native-firebase/firestore';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  profileImage?: string;
  uid: string;
}

interface MediaState {
  images: string[];
  videos: string[];
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
}

const initialState: MediaState = {
  images: [],
  videos: [],
  users: [],
  usersLoading: false,
  usersError: null,
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

export const fetchUsers = createAsyncThunk<
  {
    email: string;
    firstName: string;
    lastName: string;
    mobileNo: string;
    profileImage?: string;
    uid: string;
  }[],
  void
>('media/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const snapshot = await firestore().collection('users').get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        mobileNo: data.mobileNo || '',
        profileImage: data.profileImage,
        uid: doc.id,
      };
    });
  } catch (error: any) {
    return rejectWithValue(error?.message);
  }
});

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
      })
      .addCase(fetchUsers.pending, state => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload as string;
      });
  },
});

export const { setImages, setVideos, resetMedia } = mediaSlice.actions;
export default mediaSlice.reducer;

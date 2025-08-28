import { useEffect, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

import api from '@api/index';
import { newsService } from '../../../realm/services';

const useNews = () => {
  const [newsList, setNewsList] = useState<object[]>([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});

  const [editItem, setEditItem] = useState<any>(null);

  const fetchNews = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const response = await api.NEWS.getNews(forceRefresh);
      const newsData = response?.data?.data || [];
      setNewsList(newsData);
    } catch (error) {
      console.error('News Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const removeListener = newsService.addNewsListener(setNewsList);
    fetchNews();
    return () => removeListener();
  }, []);

  const handleDelete = async item => {
    try {
      await api.NEWS.deleteNews(item?.id);
    } catch (error) {}
  };

  const handleEdit = async item => {
    setEditItem(item);
  };

  const handlePickImage = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo' });
      if (result.didCancel || !result.assets?.[0]) return;
      const file = result.assets[0];
      setUserData(file);
    } catch (error) {
      console.error('[useUpdateProfile] Pick image error:', error);
    }
  };

  const onSubmit = async values => {
    const newNews = {
      id: values?.id ? values?.id : Date.now().toString(),
      name: values.name,
      description: values.description,
      // imageUrl: userData.uri || '',
    };

    if (editItem) {
      try {
        await api.NEWS.editNews(newNews);
      } catch (error) {}
      setEditItem(null);
      setUserData({});
      return;
    }
    try {
      await api.NEWS.addNews(newNews);
    } catch (error) {}
    setUserData({});
  };

  const onRefresh = () => {
    fetchNews(true);
  };

  return {
    newsList,
    loading,
    handleDelete,
    handlePickImage,
    userData,
    onSubmit,
    onRefresh,
    handleEdit,
    editItem,
    setEditItem,
  };
};

export default useNews;

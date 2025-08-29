import { useEffect, useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import moment from 'moment';
import NetInfo from '@react-native-community/netinfo';

import api from '@api/index';
import { newsService, timeService } from '../../../realm/services';
import { isOnline } from '@utils/helper';

const useNews = () => {
  const [newsList, setNewsList] = useState<object[]>([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});

  const [editItem, setEditItem] = useState<any>(null);

  const time = timeService.getTime('/news');

  const fetchNews = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const response = await api.NEWS.getNews(forceRefresh);
      const newsData = response?.data?.data || [];

      const sortedData = newsData?.sort?.((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setNewsList(sortedData);
    } catch (error) {
      console.error('News Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const removeListener = newsService.addNewsListener(news => {
      const sortedNews = [...news].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setNewsList(sortedNews);
    });
    // fetchNews();

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable !== false;

      if (online) {
        console.log('🔄 Online: syncing news...');
        fetchNews(true);
      } else {
        console.log('📴 Offline: showing local data');
      }
    });

    (async () => {
      const online = await isOnline();
      fetchNews(online);
    })();

    return () => {
      removeListener();
      unsubscribeNetInfo();
    };
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
      createdAt: values?.id ? values?.createdAt : moment().toISOString(),
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
    time,
  };
};

export default useNews;

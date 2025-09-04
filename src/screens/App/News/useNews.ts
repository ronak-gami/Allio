import { useEffect, useRef, useState, useCallback } from 'react';
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

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const didRunInitially = useRef(false);

  const time = timeService.getTime('/news');

  // ------------------- Fetch News -------------------
  const fetchNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    try {
      const response = await api.NEWS.getNews(forceRefresh);
      const newsData = response?.data?.data || [];

      const sortedData = newsData.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setNewsList(sortedData);
    } catch (error) {
      console.error('News Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const safeFetchNews = useCallback(
    (force = false) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchNews(force), 300);
    },
    [fetchNews],
  );

  // ------------------- Delete News -------------------
  const handleDelete = useCallback(async item => {
    try {
      await api.NEWS.deleteNews(item?.id);
    } catch (error) {
      console.error('Delete Error:', error);
    }
  }, []);

  // ------------------- Edit News -------------------
  const handleEdit = useCallback(item => {
    setEditItem(item);
  }, []);

  // ------------------- Pick Image -------------------
  const handlePickImage = useCallback(async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo' });
      if (result.didCancel || !result.assets?.[0]) return;
      const file = result.assets[0];
      setUserData(file);
    } catch (error) {
      console.error('[useNews] Pick image error:', error);
    }
  }, []);

  // ------------------- Submit News -------------------
  const onSubmit = useCallback(
    async values => {
      const newNews = {
        id: values?.id ? values?.id : Date.now().toString(),
        name: values?.name,
        description: values?.description,
        createdAt: values?.id ? values?.createdAt : moment().toISOString(),
      };

      if (editItem) {
        try {
          await api.NEWS.editNews(newNews);
        } catch (error) {
          console.error('Edit News Error:', error);
        }
        setEditItem(null);
        setUserData({});
        return;
      }

      try {
        await api.NEWS.addNews(newNews);
      } catch (error) {
        console.error('Add News Error:', error);
      }
      setUserData({});
    },
    [editItem],
  );

  // ------------------- Refresh News -------------------
  const onRefresh = useCallback(() => {
    safeFetchNews(true);
  }, [safeFetchNews]);

  // ------------------- Effects -------------------
  useEffect(() => {
    const removeListener = newsService.addNewsListener(news => {
      const sortedNews = [...news].sort(
        (a, b) =>
          new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime(),
      );
      setNewsList(sortedNews);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(async state => {
      const online = state?.isConnected && state?.isInternetReachable !== false;
      if (online) {
        if (!didRunInitially.current) {
          safeFetchNews();
          didRunInitially.current = true;
        }
      }
    });

    (async () => {
      const online = await isOnline();
      if (online && !didRunInitially.current) {
        safeFetchNews();
        didRunInitially.current = true;
      }
    })();

    return () => {
      removeListener();
      unsubscribeNetInfo();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [safeFetchNews]);

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

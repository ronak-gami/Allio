// import api from '@api/index';
// import { useEffect, useState } from 'react';

// const useNews = () => {
//   const [newsList, setNewsList] = useState<object[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchNews = async () => {
//     try {
//       setLoading(true);
//       const response = await api.NEWS.getNewsResponse();

//       console.log('response=>>', response?.data?.data); // ✅ debug here
//       const newsData = response?.data?.data || [];
//       setNewsList(newsData);
//     } catch (error) {
//       console.error('News Fetch Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   return { newsList, loading };
// };

// export default useNews;
import { useEffect, useState, useRef } from 'react';
import api from '@api/index';

const useNews = () => {
  const [newsList, setNewsList] = useState<object[]>([]);
  const [loading, setLoading] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fetchAndStoreNews = async () => {
      setLoading(true);
      try {
        const response = await api.NEWS.getNewsResponse();
        const newsData = response?.data?.data || [];
        setNewsList(newsData);
        blockedUsers.saveAllUser(newsData);
      } catch (error) {
        console.error('News Fetch Error:', error);
      } finally {
        setLoading(false);
        // Always get data from Realm after storing
        // const news = newsServices.getAllNews();
        // setNewsList(news);
      }
    };

    // if (isFirstLoad.current) {
    //   isFirstLoad.current = false;
    //   console.log('callled');
    fetchAndStoreNews();
    // } else {
    //   console.log('callled===>');
    //   // On subsequent renders, just get from Realm
    //   const news = newsServices.getAllNews();
    //   setNewsList(news);
    // }
  }, []);

  return { newsList, loading };
};

export default useNews;

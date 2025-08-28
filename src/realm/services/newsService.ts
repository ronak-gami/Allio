import { UpdateMode } from 'realm';
import { ensureValidRealm, realm } from '../reamlConfiguration';

const SchemaName = 'News';
const OfflineSchemaName = 'OfflineNews';

const saveAllNews = news => {
  ensureValidRealm(() => {
    news?.forEach?.(user => {
      realm.create(SchemaName, user, UpdateMode.Modified);
    });
  });
};

const addNews = news => {
  ensureValidRealm(() => {
    realm.create(SchemaName, news, UpdateMode.Modified);
  });
};

const getNews = () => {
  const news = realm.objects(SchemaName);
  if (news.isValid()) {
    return Array.from(news);
  } else {
    return [];
  }
};

const removeNews = newsId => {
  ensureValidRealm(() => {
    const user = realm.objectForPrimaryKey(SchemaName, newsId);
    if (user && user.isValid()) {
      realm.delete(user);
    } else {
      console.warn('User is already deleted or invalid.');
    }
  });
};

const addNewsListener = callback => {
  const newsResults = realm.objects(SchemaName);
  callback(Array.from(newsResults));
  const listener = collection => {
    callback(Array.from(collection));
  };
  newsResults.addListener(listener);
  return () => {
    newsResults.removeListener(listener);
  };
};

const deleteAllNews = () => {
  ensureValidRealm(() => {
    const all = realm.objects(SchemaName);
    realm.delete(all);
  });
};

//Offline News Handling
const addOfflineNews = news => {
  ensureValidRealm(() => {
    realm.create(OfflineSchemaName, news, UpdateMode.Modified);
  });
};

const getOfflineNews = () => {
  const news = realm.objects(OfflineSchemaName);
  if (news.isValid()) {
    return Array.from(news);
  } else {
    return [];
  }
};

const deleteAllOfflineNews = () => {
  ensureValidRealm(() => {
    const all = realm.objects(OfflineSchemaName);
    realm.delete(all);
  });
};

export default {
  saveAllNews,
  addNews,
  getNews,
  removeNews,
  addNewsListener,
  deleteAllNews,

  addOfflineNews,
  getOfflineNews,
  deleteAllOfflineNews,
};

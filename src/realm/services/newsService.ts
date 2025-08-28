import { UpdateMode } from 'realm';
import { ensureValidRealm, realm } from '../reamlConfiguration';

const SchemaName = 'News';
const OfflineSchemaName = 'OfflineNews';

const saveAllOnlineData = news => {
  ensureValidRealm(() => {
    news?.forEach?.(user => {
      realm.create(SchemaName, user, UpdateMode.Modified);
    });
  });
};

const addOnlineData = news => {
  ensureValidRealm(() => {
    realm.create(SchemaName, news, UpdateMode.Modified);
  });
};

const getOnlineData = () => {
  const news = realm.objects(SchemaName);
  if (news.isValid()) {
    return Array.from(news);
  } else {
    return [];
  }
};

const removeOnlineData = newsId => {
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

const deleteAllOnlineData = () => {
  ensureValidRealm(() => {
    const all = realm.objects(SchemaName);
    realm.delete(all);
  });
};

//Offline News Handling
const addOfflineData = news => {
  ensureValidRealm(() => {
    realm.create(OfflineSchemaName, news, UpdateMode.Modified);
  });
};

const getOfflineData = () => {
  const news = realm.objects(OfflineSchemaName);
  if (news.isValid()) {
    return Array.from(news);
  } else {
    return [];
  }
};

const deleteAllOfflineData = () => {
  ensureValidRealm(() => {
    const all = realm.objects(OfflineSchemaName);
    realm.delete(all);
  });
};

export default {
  saveAllOnlineData,
  addOnlineData,
  getOnlineData,
  removeOnlineData,
  addNewsListener,
  deleteAllOnlineData,

  addOfflineData,
  getOfflineData,
  deleteAllOfflineData,
};

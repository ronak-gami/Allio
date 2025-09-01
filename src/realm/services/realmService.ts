import { UpdateMode } from 'realm';
import { ensureValidRealm, realm } from '../reamlConfiguration';

const saveAllOnlineData = (schemaName: string, data) => {
  ensureValidRealm(() => {
    data?.forEach?.(item => {
      realm.create(schemaName, item, UpdateMode.Modified);
    });
  });
};

const addOnlineData = (schemaName: string, item) => {
  ensureValidRealm(() => {
    realm.create(schemaName, item, UpdateMode.Modified);
  });
};

const getOnlineData = (schemaName: string) => {
  const data = realm.objects(schemaName);
  return data.isValid() ? Array.from(data) : [];
};

const removeOnlineData = (schemaName: string, id) => {
  ensureValidRealm(() => {
    const record = realm.objectForPrimaryKey(schemaName, id);
    if (record && record.isValid()) {
      realm.delete(record);
    } else {
      console.warn(`${schemaName} record already deleted or invalid.`);
    }
  });
};

const addListener = (schemaName: string, callback) => {
  const results = realm.objects(schemaName);
  callback(Array.from(results));
  const listener = collection => {
    callback(Array.from(collection));
  };
  results.addListener(listener);
  return () => {
    results.removeListener(listener);
  };
};

const deleteAllOnlineData = (schemaName: string) => {
  ensureValidRealm(() => {
    const all = realm.objects(schemaName);
    realm.delete(all);
  });
};

// ----- Offline -----
const addOfflineData = (offlineSchemaName: string, item) => {
  ensureValidRealm(() => {
    realm.create(offlineSchemaName, item, UpdateMode.Modified);
  });
};

const getOfflineData = (offlineSchemaName: string) => {
  const data = realm.objects(offlineSchemaName);
  return data.isValid() ? Array.from(data) : [];
};

const deleteAllOfflineData = (offlineSchemaName: string) => {
  ensureValidRealm(() => {
    const all = realm.objects(offlineSchemaName);
    realm.delete(all);
  });
};

export default {
  saveAllOnlineData,
  addOnlineData,
  getOnlineData,
  removeOnlineData,
  addListener,
  deleteAllOnlineData,

  addOfflineData,
  getOfflineData,
  deleteAllOfflineData,
};

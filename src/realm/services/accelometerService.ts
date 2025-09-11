import { UpdateMode } from 'realm';
import { ensureValidRealm, realm } from '../reamlConfiguration';

const SchemaName = 'Accelerometer';

const initializeStaticData = () => {
  const staticData = [
    { id: '1', name: 'Item 1', time: 0 },
    { id: '2', name: 'Item 2', time: 0 },
    { id: '3', name: 'Item 3', time: 0 },
  ];

  ensureValidRealm(() => {
    // Check if data already exists
    const existingData = realm.objects(SchemaName);
    if (existingData.length === 0) {
      staticData.forEach(item => {
        realm.create(SchemaName, item, UpdateMode.Modified);
      });
    }
  });
};

const updateItemTime = (id: string, time: number) => {
  ensureValidRealm(() => {
    // Use UpdateMode.Modified with create instead of manual write transaction
    realm.create(SchemaName, { id, time }, UpdateMode.Modified);
  });
};

const getAccelerometerData = () => {
  const data = realm.objects(SchemaName);
  if (data.isValid()) {
    return Array.from(data);
  } else {
    return [];
  }
};

const getItemById = (id: string) => {
  const item = realm.objectForPrimaryKey(SchemaName, id);
  if (item && item.isValid()) {
    return {
      id: item.id,
      name: item.name,
      time: item.time,
    };
  }
  return null;
};

const addAccelerometerListener = callback => {
  const accelerometerResults = realm.objects(SchemaName);
  callback(Array.from(accelerometerResults));
  const listener = collection => {
    callback(Array.from(collection));
  };
  accelerometerResults.addListener(listener);
  return () => {
    accelerometerResults.removeListener(listener);
  };
};

const resetItemTime = (id: string) => {
  updateItemTime(id, 0);
};

const deleteAllData = () => {
  ensureValidRealm(() => {
    const all = realm.objects(SchemaName);
    realm.delete(all);
  });
};

export default {
  initializeStaticData,
  updateItemTime,
  getAccelerometerData,
  getItemById,
  addAccelerometerListener,
  resetItemTime,
  deleteAllData,
};

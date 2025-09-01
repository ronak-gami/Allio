import { UpdateMode } from 'realm';
import { ensureValidRealm, realm } from '../reamlConfiguration';

const SchemaName = 'Timestamp';

const addTime = time => {
  ensureValidRealm(() => {
    realm.create(SchemaName, time, UpdateMode.Modified);
  });
};

const getTime = (key: string) => {
  const records = realm.objects(SchemaName);
  if (records.isValid()) {
    const record = records.filtered(`key == $0`, key)[0];
    return record?.timeStamp ?? null;
  }
  return null;
};

export default { addTime, getTime };

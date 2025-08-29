import { Realm } from '@realm/react';

const newsSchema = (name: string) => {
  return {
    name,
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string?',
      createdAt: 'string?',
      // imageUrl: 'string?',
      description: 'string?',
      deletedFlag: 'bool?',
      editedFlag: 'bool?',
    },
  };
};

const timestampSchema = (name: string) => {
  return {
    name,
    primaryKey: 'key',
    properties: {
      key: 'string',
      timeStamp: 'string',
    },
  };
};

class News extends Realm.Object {
  static schema = newsSchema('News');
}

class OfflineNews extends Realm.Object {
  static schema = newsSchema('OfflineNews');
}

class Timestamp extends Realm.Object {
  static schema = timestampSchema('Timestamp');
}

const Schemas = [News, OfflineNews, Timestamp];

export default Schemas;

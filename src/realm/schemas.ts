import { Realm } from '@realm/react';

const newsSchema = (name: string) => {
  return {
    name,
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string?',
      // imageUrl: 'string?',
      description: 'string?',
      deletedFlag: 'bool?',
      editedFlag: 'bool?',
    },
  };
};

class News extends Realm.Object {
  static schema = newsSchema('News');
}

class OfflineNews extends Realm.Object {
  static schema = newsSchema('OfflineNews');
}

const Schemas = [News, OfflineNews];

export default Schemas;

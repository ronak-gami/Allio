import { Realm } from '@realm/react';

const newsSchema = (name: string) => {
  return {
    name,
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string?',
      imageUrl: 'string?',
      description: 'string?',
    },
  };
};

class News extends Realm.Object {
  static schema = newsSchema('News');
}

const Schemas = [News];

export default Schemas;

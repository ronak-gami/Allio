import { UpdateMode } from 'realm';
import { ensureValidRealm, realm } from '..';

const SchemaName = 'News';

const saveAllUser = users => {
  console.log('users=>', users);

  ensureValidRealm(() => {
    users?.forEach?.(user => {
      realm.create(SchemaName, user, UpdateMode.Modified);
    });
  });
};

const blockUser = user => {
  ensureValidRealm(() => {
    realm.create(SchemaName, user, UpdateMode.Modified);
  });
};

const getUsers = () => {
  const users = realm.objects(SchemaName);
  if (users.isValid()) {
    return Array.from(users);
  } else {
    return [];
  }
};

const unblockUsers = userId => {
  ensureValidRealm(() => {
    const user = realm.objectForPrimaryKey(SchemaName, userId);
    if (user && user.isValid()) {
      realm.delete(user);
    } else {
      console.warn('User is already deleted or invalid.');
    }
  });
};

export default {
  saveAllUser,
  blockUser,
  getUsers,
  unblockUsers,
};

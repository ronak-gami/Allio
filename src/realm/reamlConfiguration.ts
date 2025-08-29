import Realm from 'realm';
import Schemas from './schemas';

// Initialize Realm instance
const realm = new Realm({
  schema: Schemas, // Add all your schemas here
  schemaVersion: 1, // Increment this when you change schemas
  onMigration: (oldRealm, newRealm) => {
    // Handle schema migration logic if needed
  },
});

const ensureValidRealm = (operation: () => void) => {
  if (realm.isClosed) {
    console.warn('Realm is closed. Reopening...');
    new Realm({ schema: Schemas }); // Adjust this line based on your Realm configuration
  }

  try {
    realm.write(() => {
      operation();
    });
  } catch (error) {
    console.error('Error in Realm operation:', error);
    throw error;
  }
};

// Centralized export for accessing the realm instance
export { realm, ensureValidRealm };

# Realm Offline-First Todo Implementation

Complete guide for implementing offline-first Todo feature using Realm in the News section of Allio.

## Quick Overview

**Features:**

- Offline-first architecture
- Auto-sync when online
- CRUD operations (Create, Read, Update, Delete)
- Real-time updates
- Conflict resolution

**Dependencies:**

- `realm@12.6.2`

---

## Step 1: Realm Configuration

### src/realm/schemas/TodoSchema.js

```javascript
export const TodoSchema = {
  name: 'Todo',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    title: 'string',
    description: 'string?',
    completed: { type: 'bool', default: false },
    userId: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    synced: { type: 'bool', default: false },
  },
};

src/realm/realmConfig.js
JavaScript
import Realm from 'realm';
import { TodoSchema } from './schemas/TodoSchema';

let realmInstance = null;

export const initRealm = async () => {
  try {
    realmInstance = await Realm.open({
      schema: [TodoSchema],
      schemaVersion: 1,
    });
    console.log('Realm initialized');
    return realmInstance;
  } catch (error) {
    console.error('Realm Init Error:', error);
    throw error;
  }
};

export const getRealm = () => {
  if (!realmInstance) {
    throw new Error('Realm not initialized. Call initRealm() first.');
  }
  return realmInstance;
};

export const closeRealm = () => {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
};
Step 2: Todo Service
src/realm/services/todoService.js
JavaScript
import { getRealm } from '../realmConfig';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';

class TodoService {
  /**
   * Create new todo (offline-first)
   */
  createTodo(title, description = '') {
    const realm = getRealm();
    const userId = auth().currentUser.uid;
    const todoId = `${userId}_${Date.now()}`;

    try {
      realm.write(() => {
        realm.create('Todo', {
          _id: todoId,
          title,
          description,
          completed: false,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          synced: false,
        });
      });

      // Sync to Firestore if online
      this.syncToFirestore(todoId);

      return { success: true, todoId };
    } catch (error) {
      console.error('Create Todo Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all todos for current user
   */
  getTodos() {
    const realm = getRealm();
    const userId = auth().currentUser.uid;

    const todos = realm
      .objects('Todo')
      .filtered('userId == $0', userId)
      .sorted('createdAt', true);

    return Array.from(todos);
  }

  /**
   * Update todo
   */
  updateTodo(todoId, updates) {
    const realm = getRealm();

    try {
      realm.write(() => {
        const todo = realm.objectForPrimaryKey('Todo', todoId);
        if (todo) {
          Object.keys(updates).forEach((key) => {
            todo[key] = updates[key];
          });
          todo.updatedAt = new Date();
          todo.synced = false;
        }
      });

      this.syncToFirestore(todoId);

      return { success: true };
    } catch (error) {
      console.error('Update Todo Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete todo
   */
  deleteTodo(todoId) {
    const realm = getRealm();

    try {
      realm.write(() => {
        const todo = realm.objectForPrimaryKey('Todo', todoId);
        if (todo) {
          realm.delete(todo);
        }
      });

      this.deleteFromFirestore(todoId);

      return { success: true };
    } catch (error) {
      console.error('Delete Todo Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync local todo to Firestore
   */
  async syncToFirestore(todoId) {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    const realm = getRealm();
    const todo = realm.objectForPrimaryKey('Todo', todoId);

    if (!todo) return;

    try {
      await firestore().collection('todos').doc(todoId).set({
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        userId: todo.userId,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      });

      // Mark as synced
      realm.write(() => {
        todo.synced = true;
      });

      console.log('Todo synced:', todoId);
    } catch (error) {
      console.error('Sync Error:', error);
    }
  }

  /**
   * Delete from Firestore
   */
  async deleteFromFirestore(todoId) {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    try {
      await firestore().collection('todos').doc(todoId).delete();
      console.log('Todo deleted from Firestore:', todoId);
    } catch (error) {
      console.error('Delete from Firestore Error:', error);
    }
  }

  /**
   * Sync all unsynced todos
   */
  async syncAll() {
    const realm = getRealm();
    const userId = auth().currentUser.uid;

    const unsyncedTodos = realm
      .objects('Todo')
      .filtered('userId == $0 AND synced == false', userId);

    for (const todo of unsyncedTodos) {
      await this.syncToFirestore(todo._id);
    }
  }

  /**
   * Pull todos from Firestore
   */
  async pullFromFirestore() {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) return;

    const userId = auth().currentUser.uid;
    const realm = getRealm();

    try {
      const snapshot = await firestore()
        .collection('todos')
        .where('userId', '==', userId)
        .get();

      realm.write(() => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const existingTodo = realm.objectForPrimaryKey('Todo', doc.id);

          if (existingTodo) {
            // Update if Firestore version is newer
            if (data.updatedAt.toDate() > existingTodo.updatedAt) {
              existingTodo.title = data.title;
              existingTodo.description = data.description;
              existingTodo.completed = data.completed;
              existingTodo.updatedAt = data.updatedAt.toDate();
              existingTodo.synced = true;
            }
          } else {
            // Create new
            realm.create('Todo', {
              _id: doc.id,
              title: data.title,
              description: data.description,
              completed: data.completed,
              userId: data.userId,
              createdAt: data.createdAt.toDate(),
              updatedAt: data.updatedAt.toDate(),
              synced: true,
            });
          }
        });
      });

      console.log('Pulled todos from Firestore');
    } catch (error) {
      console.error('Pull from Firestore Error:', error);
    }
  }
}

export default new TodoService();
Step 3: Todo Screen
src/screens/News/TodoScreen.js
JavaScript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import todoService from '../../realm/services/todoService';
import NetInfo from '@react-native-community/netinfo';
import { getRealm } from '../../realm/realmConfig';

const TodoScreen = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    loadTodos();

    // Listen to Realm changes
    const realm = getRealm();
    const todoObjects = realm.objects('Todo');

    todoObjects.addListener(() => {
      loadTodos();
    });

    // Network listener
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        syncData();
      }
    });

    return () => {
      todoObjects.removeAllListeners();
      unsubscribe();
    };
  }, []);

  const loadTodos = () => {
    const allTodos = todoService.getTodos();
    setTodos(allTodos);
  };

  const syncData = async () => {
    await todoService.pullFromFirestore();
    await todoService.syncAll();
  };

  const handleAddTodo = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const result = todoService.createTodo(title);
    if (result.success) {
      setTitle('');
    }
  };

  const handleToggleComplete = (todoId, completed) => {
    todoService.updateTodo(todoId, { completed: !completed });
  };

  const handleDeleteTodo = (todoId) => {
    Alert.alert('Delete Todo', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => todoService.deleteTodo(todoId),
      },
    ]);
  };

  const renderTodo = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => handleToggleComplete(item._id, item.completed)}
      >
        <Text>{item.completed ? '✓' : ''}</Text>
      </TouchableOpacity>

      <View style={styles.todoContent}>
        <Text style={[styles.title, item.completed && styles.completed]}>
          {item.title}
        </Text>
        {!item.synced && <Text style={styles.syncStatus}>⏳ Pending sync</Text>}
      </View>

      <TouchableOpacity onPress={() => handleDeleteTodo(item._id)}>
        <Text style={styles.deleteBtn}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Todos</Text>
        <Text style={styles.status}>{isOnline ? '🟢 Online' : '🔴 Offline'}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Add new todo..."
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddTodo}>
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#4285F4',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  status: { fontSize: 14, color: '#fff' },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '600' },
  list: { padding: 15 },
  todoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4285F4',
    borderRadius: 4,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoContent: { flex: 1 },
  title: { fontSize: 16, color: '#333' },
  completed: { textDecorationLine: 'line-through', color: '#999' },
  syncStatus: { fontSize: 12, color: '#ff9800', marginTop: 4 },
  deleteBtn: { fontSize: 20 },
});

export default TodoScreen;
Step 4: Initialize Realm in App.js
App.js (add initialization)
JavaScript
import React, { useEffect } from 'react';
import { initRealm, closeRealm } from './src/realm/realmConfig';

export default function App() {
  useEffect(() => {
    initRealm();
    return () => closeRealm();
  }, []);

  // Rest of your app...
}
Firestore Security Rules
JavaScript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      allow read, write: if request.auth != null &&
                            request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
Features Implemented
✅ Offline-first CRUD operations
✅ Auto-sync when online
✅ Real-time Realm updates
✅ Conflict resolution (newest wins)
✅ Sync status indicators
✅ Network status detection

Testing Checklist
 Create todo while offline
 Todo appears immediately in list
 Go online and verify sync
 Update todo offline
 Delete todo offline
 Sync status shows correctly
 Multiple devices sync properly
Implementation Complete! 📝
```

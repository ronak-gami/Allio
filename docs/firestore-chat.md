# Firestore Chat Implementation Guide

Complete guide for implementing real-time chat using Firestore in Allio React Native application.

## Quick Overview

**Features:**

- Real-time messaging with Firestore
- Media messages (images, videos)
- Typing indicators
- User presence tracking
- Read receipts
- Message delivery status
- Chat room management

**Dependencies Used:**

- `@react-native-firebase/firestore@23.4.0`
- `@react-native-firebase/storage@23.4.0`
- `react-native-image-picker@8.2.1`

---

## Firestore Database Structure

---

## Step 1: Chat Service

### src/services/chatService.js

````javascript
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

class ChatService {
  /**
   * Create or get existing chat room between two users
   */
  async createOrGetChatRoom(otherUserId) {
    try {
      const currentUserId = auth().currentUser.uid;

      // Create consistent room ID (alphabetically sorted)
      const participants = [currentUserId, otherUserId].sort();
      const chatRoomId = participants.join('_');

      const chatRoomRef = firestore().collection('chatRooms').doc(chatRoomId);
      const chatRoom = await chatRoomRef.get();

      if (!chatRoom.exists) {
        // Create new chat room
        await chatRoomRef.set({
          participants,
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastMessage: '',
          lastMessageTime: firestore.FieldValue.serverTimestamp(),
          typing: {},
        });
      }

      return { success: true, chatRoomId };
    } catch (error) {
      console.error('Create Chat Room Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send text message
   */
  async sendMessage(chatRoomId, text) {
    try {
      const currentUser = auth().currentUser;

      const messageRef = firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messages')
        .doc();

      await messageRef.set({
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        text,
        timestamp: firestore.FieldValue.serverTimestamp(),
        read: false,
        delivered: false,
      });

      // Update chat room last message
      await firestore().collection('chatRooms').doc(chatRoomId).update({
        lastMessage: text,
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, messageId: messageRef.id };
    } catch (error) {
      console.error('Send Message Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send media message (image/video)
   */
  async sendMediaMessage(chatRoomId, mediaUri, mediaType) {
    try {
      const currentUser = auth().currentUser;
      const timestamp = Date.now();
      const filename = `${currentUser.uid}_${timestamp}`;

      // Upload to Firebase Storage
      const reference = storage().ref(`chat_media/${chatRoomId}/${filename}`);
      await reference.putFile(mediaUri);
      const mediaUrl = await reference.getDownloadURL();

      // Create message with media
      const messageRef = firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messages')
        .doc();

      await messageRef.set({
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        text: '',
        mediaUrl,
        mediaType, // 'image' or 'video'
        timestamp: firestore.FieldValue.serverTimestamp(),
        read: false,
        delivered: false,
      });

      // Update chat room
      await firestore().collection('chatRooms').doc(chatRoomId).update({
        lastMessage: `Sent a ${mediaType}`,
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, messageId: messageRef.id, mediaUrl };
    } catch (error) {
      console.error('Send Media Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Subscribe to messages in real-time
   */
  subscribeToMessages(chatRoomId, callback) {
    return firestore()
      .collection('messages')
      .doc(chatRoomId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(messages);
        },
        (error) => {
          console.error('Subscribe Messages Error:', error);
        }
      );
  }

  /**
   * Subscribe to chat rooms list
   */
  subscribeToChatRooms(callback) {
    const currentUserId = auth().currentUser.uid;

    return firestore()
      .collection('chatRooms')
      .where('participants', 'array-contains', currentUserId)
      .orderBy('lastMessageTime', 'desc')
      .onSnapshot(
        async (snapshot) => {
          const chatRooms = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();

              // Get other user info
              const otherUserId = data.participants.find((id) => id !== currentUserId);
              const otherUserDoc = await firestore()
                .collection('users')
                .doc(otherUserId)
                .get();

              return {
                id: doc.id,
                ...data,
                otherUser: otherUserDoc.exists ? otherUserDoc.data() : null,
              };
            })
          );
          callback(chatRooms);
        },
        (error) => {
          console.error('Subscribe Chat Rooms Error:', error);
        }
      );
  }

  /**
   * Update typing status
   */
  async setTypingStatus(chatRoomId, isTyping) {
    try {
      const currentUserId = auth().currentUser.uid;

      await firestore()
        .collection('chatRooms')
        .doc(chatRoomId)
        .update({
          [`typing.${currentUserId}`]: isTyping,
        });
    } catch (error) {
      console.error('Set Typing Status Error:', error);
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(chatRoomId, messageId) {
    try {
      await firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messages')
        .doc(messageId)
        .update({ read: true });
    } catch (error) {
      console.error('Mark As Read Error:', error);
    }
  }

  /**
   * Update user presence
   */
  async updateUserPresence(isOnline) {
    try {
      const currentUserId = auth().currentUser.uid;

      await firestore().collection('users').doc(currentUserId).update({
        isOnline,
        lastSeen: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Update Presence Error:', error);
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(chatRoomId, messageId) {
    try {
      await firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messages')
        .doc(messageId)
        .delete();

      return { success: true };
    } catch (error) {
      console.error('Delete Message Error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ChatService();

Copilot said: Perfect! Here's the complete **single file** with
Perfect! Here's the complete single file with all the content:


firestore-chat.md
v3
# Firestore Chat Implementation Guide

Complete guide for implementing real-time chat using Firestore in Allio React Native application.

## Quick Overview

firestore/ ├── users/ │ └── {userId}/ │ ├── name: string │ ├── avatar: string │ ├── isOnline: boolean │ └── lastSeen: timestamp │ ├── chatRooms/ │ └── {chatRoomId}/ │ ├── participants: array<userId> │ ├── lastMessage: string │ ├── lastMessageTime: timestamp │ ├── createdAt: timestamp │ └── typing: {userId: boolean} │ └── messages/ └── {chatRoomId}/ └── messages/ └── {messageId}/ ├── senderId: string ├── text: string ├── mediaUrl: string (optional) ├── mediaType: string (optional) ├── timestamp: timestamp ├── read: boolean └── delivered: boolean

Code

---

## Step 1: Chat Service

### src/services/chatService.js

```javascript
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

class ChatService {
  /**
   * Create or get existing chat room between two users
   */
  async createOrGetChatRoom(otherUserId) {
    try {
      const currentUserId = auth().currentUser.uid;

      // Create consistent room ID (alphabetically sorted)
      const participants = [currentUserId, otherUserId].sort();
      const chatRoomId = participants.join('_');

      const chatRoomRef = firestore().collection('chatRooms').doc(chatRoomId);
      const chatRoom = await chatRoomRef.get();

      if (!chatRoom.exists) {
        // Create new chat room
        await chatRoomRef.set({
          participants,
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastMessage: '',
          lastMessageTime: firestore.FieldValue.serverTimestamp(),
          typing: {},
        });
      }

      return { success: true, chatRoomId };
    } catch (error) {
      console.error('Create Chat Room Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send text message
   */
  async sendMessage(chatRoomId, text) {
    try {
      const currentUser = auth().currentUser;

      const messageRef = firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messages')
        .doc();

      await messageRef.set({
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        text,
        timestamp: firestore.FieldValue.serverTimestamp(),
        read: false,
        delivered: false,
      });

      // Update chat room last message
      await firestore().collection('chatRooms').doc(chatRoomId).update({
        lastMessage: text,
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, messageId: messageRef.id };
    } catch (error) {
      console.error('Send Message Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send media message (image/video)
   */
  async sendMediaMessage(chatRoomId, mediaUri, mediaType) {
    try {
      const currentUser = auth().currentUser;
      const timestamp = Date.now();
      const filename = `${currentUser.uid}_${timestamp}`;

      // Upload to Firebase Storage
      const reference = storage().ref(`chat_media/${chatRoomId}/${filename}`);
      await reference.putFile(mediaUri);
      const mediaUrl = await reference.getDownloadURL();

      // Create message with media
      const messageRef = firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messages')
        .doc();

      await messageRef.set({
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'User',
        text: '',
        mediaUrl,
        mediaType, // 'image' or 'video'
        timestamp: firestore.FieldValue.serverTimestamp(),
        read: false,
        delivered: false,
      });

      // Update chat room
      await firestore().collection('chatRooms').doc(chatRoomId).update({
        lastMessage: `Sent a ${mediaType}`,
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, messageId: messageRef.id, mediaUrl };
    } catch (error) {
      console.error('Send Media Error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Subscribe to messages in real-time
   */
  subscribeToMessages(chatRoomId, callback) {
    return firestore()
      .collection('messages')
      .doc(chatRoomId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(messages);
        },
        (error) => {
          console.error('Subscribe Messages Error:', error);
        }
      );
  }

  /**
   * Subscribe to chat rooms list
   */
  subscribeToChatRooms(callback) {
    const currentUserId = auth().currentUser.uid;

    return firestore()
      .collection('chatRooms')
      .where('participants', 'array-contains', currentUserId)
      .orderBy('lastMessageTime', 'desc')
      .onSnapshot(
        async (snapshot) => {
          const chatRooms = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();

              // Get other user info
              const otherUserId = data.participants.find((id) => id !== currentUserId);
              const otherUserDoc = await firestore()
                .collection('users')
                .doc(otherUserId)
                .get();

              return {
                id: doc.id,
                ...data,
                otherUser: otherUserDoc.exists ? otherUserDoc.data() : null,
              };
            })
          );
          callback(chatRooms);
        },
        (error) => {
          console.error('Subscribe Chat Rooms Error:', error);
        }
      );
  }

  /**
   * Update typing status
   */
  async setTypingStatus(chatRoomId, isTyping) {
    try {
      const currentUserId = auth().currentUser.uid;

      await firestore()
        .collection('chatRooms')
        .doc(chatRoomId)
        .update({
          [`typing.${currentUserId}`]: isTyping,
        });
    } catch (error) {
      console.error('Set Typing Status Error:', error);
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(chatRoomId, messageId) {
    try {
      await firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messages')
        .doc(messageId)
        .update({ read: true });
    } catch (error) {
      console.error('Mark As Read Error:', error);
    }
  }

  /**
   * Update user presence
   */
  async updateUserPresence(isOnline) {
    try {
      const currentUserId = auth().currentUser.uid;

      await firestore().collection('users').doc(currentUserId).update({
        isOnline,
        lastSeen: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Update Presence Error:', error);
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(chatRoomId, messageId) {
    try {
      await firestore()
        .collection('messages')
        .doc(chatRoomId)
        .collection('messages')
        .doc(messageId)
        .delete();

      return { success: true };
    } catch (error) {
      console.error('Delete Message Error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ChatService();
Step 2: Media Picker Helper
src/utils/mediaPicker.js
JavaScript
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Platform, Alert } from 'react-native';

export const pickImage = async () => {
  return new Promise((resolve) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      (response) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.error) {
          Alert.alert('Error', response.error);
          resolve(null);
        } else {
          resolve({
            uri: response.assets[0].uri,
            type: 'image',
          });
        }
      }
    );
  });
};

export const takePhoto = async () => {
  return new Promise((resolve) => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      },
      (response) => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.error) {
          Alert.alert('Error', response.error);
          resolve(null);
        } else {
          resolve({
            uri: response.assets[0].uri,
            type: 'image',
          });
        }
      }
    );
  });
};
Step 3: Chat Screen
src/screens/ChatScreen.js
JavaScript
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import chatService from '../services/chatService';
import { pickImage, takePhoto } from '../utils/mediaPicker';
import auth from '@react-native-firebase/auth';

const ChatScreen = ({ route }) => {
  const { chatRoomId, otherUserName } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUserId = auth().currentUser.uid;

  useEffect(() => {
    // Subscribe to messages
    const unsubscribe = chatService.subscribeToMessages(chatRoomId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  useEffect(() => {
    // Update presence on mount/unmount
    chatService.updateUserPresence(true);
    return () => chatService.updateUserPresence(false);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');
    setIsTyping(false);
    chatService.setTypingStatus(chatRoomId, false);

    await chatService.sendMessage(chatRoomId, text);
  };

  const handleInputChange = (text) => {
    setInputText(text);

    // Update typing indicator
    if (!isTyping) {
      setIsTyping(true);
      chatService.setTypingStatus(chatRoomId, true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      chatService.setTypingStatus(chatRoomId, false);
    }, 2000);
  };

  const handleSendMedia = async () => {
    const media = await pickImage();
    if (!media) return;

    setLoading(true);
    await chatService.sendMediaMessage(chatRoomId, media.uri, media.type);
    setLoading(false);
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === currentUserId;

    return (
      <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
        {item.mediaUrl ? (
          <Image source={{ uri: item.mediaUrl }} style={styles.mediaImage} />
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
        <Text style={styles.timestamp}>
          {item.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={styles.messagesList}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.mediaButton} onPress={handleSendMedia}>
          <Text style={styles.mediaButtonText}>📷</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleInputChange}
          placeholder="Type a message..."
          multiline
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesList: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4285F4',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E8E8',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  mediaButton: {
    padding: 10,
  },
  mediaButtonText: {
    fontSize: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
Step 4: Chat List Screen
src/screens/ChatListScreen.js
JavaScript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import chatService from '../services/chatService';

const ChatListScreen = ({ navigation }) => {
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = chatService.subscribeToChatRooms((rooms) => {
      setChatRooms(rooms);
    });

    return () => unsubscribe();
  }, []);

  const renderChatRoom = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('Chat', {
          chatRoomId: item.id,
          otherUserName: item.otherUser?.name || 'User',
        })
      }
    >
      <Image
        source={{ uri: item.otherUser?.avatar || 'https://via.placeholder.com/50' }}
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.userName}>{item.otherUser?.name || 'Unknown'}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage || 'No messages yet'}
        </Text>
      </View>
      <Text style={styles.time}>
        {item.lastMessageTime?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});

export default ChatListScreen;
Step 5: Firestore Security Rules
In Firebase Console → Firestore → Rules:

JavaScript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Chat rooms
    match /chatRooms/{chatRoomId} {
      allow read: if request.auth != null &&
                     request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                       request.auth.uid in resource.data.participants;
    }

    // Messages
    match /messages/{chatRoomId}/messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                       request.auth.uid == resource.data.senderId;
      allow delete: if request.auth != null &&
                       request.auth.uid == resource.data.senderId;
    }
  }
}
Step 6: Firebase Storage Rules
In Firebase Console → Storage → Rules:

JavaScript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /chat_media/{chatRoomId}/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                      request.resource.size < 5 * 1024 * 1024; // 5MB max
    }
  }
}
Testing Checklist
 Create chat room between two users
 Send text messages
 Receive messages in real-time
 Send image messages
 Typing indicator works
 Read receipts update
 User presence tracking
 Messages ordered correctly
 Chat list shows latest messages
 Security rules prevent unauthorized access
Best Practices
Optimize Queries: Use .limit() to load messages in batches
Handle Offline: Firestore automatically handles offline mode
Clean Up: Always unsubscribe from listeners in useEffect cleanup
Media Size: Compress images before uploading
Pagination: Implement pagination for large chat histories
Troubleshooting
Issue	Solution
Messages not updating	Check Firestore rules, ensure subscription is active
Media upload fails	Check Storage rules, verify file size < 5MB
Typing indicator stuck	Add timeout to reset typing status
Messages out of order	Verify .orderBy('timestamp', 'desc')
Implementation Complete! 💬

````

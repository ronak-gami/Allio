# Audio and Video Calls Implementation Guide

Complete guide for implementing video calls in Allio using GetStream Video SDK.

## Quick Overview

**Stack:**

- React Native 0.76.7
- GetStream Video SDK 1.21.2
- Firebase Auth (for user authentication)
- Express Backend (for token generation)

**Time to implement:** ~2-3 hours

---

## Step 1: GetStream Account Setup

### 1.1 Create Account

1. Go to https://getstream.io and sign up
2. Create new app named "Allio"
3. Select region (US East, Europe, Singapore, or Sydney)
4. Copy **API Key** and **API Secret** from dashboard

---

## Step 2: Install Dependencies

```bash
# Install all packages at once
npm install @stream-io/video-react-native-sdk@1.21.2 \
  @stream-io/react-native-webrtc@125.4.4 \
  react-native-callkeep@4.3.16 \
  react-native-incall-manager@4.2.1 \
  react-native-permissions@5.4.2 \
  nanoid@3.3.7

# iOS only
cd ios && pod install && cd ..
```

---

## Step 3: Android Configuration

### android/build.gradle

```gradle
buildscript {
    ext {
        minSdkVersion = 24
        compileSdkVersion = 34
        kotlinVersion = "1.9.22"
    }
}
```

### android/app/build.gradle

```gradle
android {
    defaultConfig {
        minSdkVersion 24
        multiDexEnabled true
    }

    packagingOptions {
        pickFirst 'lib/*/libc++_shared.so'
    }
}

dependencies {
    implementation "org.webrtc:google-webrtc:1.0.+"
}
```

### android/app/src/main/AndroidManifest.xml

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
</manifest>
```

---

## Step 4: iOS Configuration

### ios/Podfile

```ruby
platform :ios, '13.4'

target 'Allio' do
  # Permissions
  permissions_path = '../node_modules/react-native-permissions/ios'
  pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
  pod 'Permission-Microphone', :path => "#{permissions_path}/Microphone"
end
```

### ios/Allio/Info.plist

```xml
<dict>
    <key>NSCameraUsageDescription</key>
    <string>Camera access needed for video calls</string>

    <key>NSMicrophoneUsageDescription</key>
    <string>Microphone access needed for voice and video calls</string>

    <key>UIBackgroundModes</key>
    <array>
        <string>audio</string>
        <string>voip</string>
    </array>
</dict>
```

---

## Step 5: Backend Server (Token Generation)

Create a separate backend folder:

```bash
mkdir allio-backend && cd allio-backend
npm init -y
npm install express stream-chat cors dotenv
```

### server.js

```javascript
const express = require('express');
const { StreamChat } = require('stream-chat');
require('dotenv').config();

const app = express();
app.use(express.json());

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET,
);

app.post('/stream/token', async (req, res) => {
  try {
    const { userId, userName } = req.body;

    await serverClient.upsertUser({
      id: userId,
      name: userName || `User ${userId}`,
    });

    const token = serverClient.createToken(userId);

    res.json({
      success: true,
      token,
      apiKey: process.env.STREAM_API_KEY,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### .env

```env
STREAM_API_KEY=your_api_key_here
STREAM_API_SECRET=your_api_secret_here
```

**Start server:** `node server.js`

---

## Step 6: Stream Configuration

### src/config/streamConfig.js

```javascript
import { StreamVideoClient } from '@stream-io/video-react-native-sdk';
import auth from '@react-native-firebase/auth';

const BACKEND_URL = 'http://localhost:3000';
let streamClient = null;

export const initializeStreamClient = async () => {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const response = await fetch(`${BACKEND_URL}/stream/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.uid,
        userName: currentUser.displayName || 'User',
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    streamClient = new StreamVideoClient({
      apiKey: data.apiKey,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName || 'User',
      },
      token: data.token,
    });

    return { success: true, client: streamClient };
  } catch (error) {
    console.error('Init Error:', error);
    return { success: false, error: error.message };
  }
};

export const getStreamClient = () => streamClient;

export const disconnectStreamClient = async () => {
  if (streamClient) {
    await streamClient.disconnectUser();
    streamClient = null;
  }
};
```

---

## Step 7: Video Call Service

### src/services/videoCallService.js

```javascript
import { getStreamClient } from '../config/streamConfig';

class VideoCallService {
  async createCall(callId) {
    const client = getStreamClient();
    const call = client.call('default', callId);
    await call.join({ create: true });
    return { success: true, call };
  }

  async joinCall(callId) {
    const client = getStreamClient();
    const call = client.call('default', callId);
    await call.join();
    return { success: true, call };
  }

  async leaveCall(call) {
    await call.leave();
  }

  async toggleCamera(call) {
    await call.camera.toggle();
  }

  async toggleMicrophone(call) {
    await call.microphone.toggle();
  }

  async switchCamera(call) {
    await call.camera.flip();
  }
}

export default new VideoCallService();
```

---

## Step 8: Permissions Helper

### src/utils/callPermissions.js

```javascript
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestCallPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    return (
      granted['android.permission.CAMERA'] === 'granted' &&
      granted['android.permission.RECORD_AUDIO'] === 'granted'
    );
  } else {
    const camera = await request(PERMISSIONS.IOS.CAMERA);
    const mic = await request(PERMISSIONS.IOS.MICROPHONE);

    if (camera !== RESULTS.GRANTED || mic !== RESULTS.GRANTED) {
      Alert.alert('Permissions Required', 'Enable permissions in Settings', [
        { text: 'Cancel' },
        { text: 'Settings', onPress: () => Linking.openSettings() },
      ]);
      return false;
    }
    return true;
  }
};
```

---

## Step 9: Video Call Screen

### src/screens/VideoCallScreen.js

```javascript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { CallContent } from '@stream-io/video-react-native-sdk';
import videoCallService from '../services/videoCallService';

const VideoCallScreen = ({ route, navigation }) => {
  const { callId, isOutgoing, otherUserName } = route.params;
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initCall();
    return () => call && videoCallService.leaveCall(call);
  }, []);

  const initCall = async () => {
    const result = isOutgoing
      ? await videoCallService.createCall(callId)
      : await videoCallService.joinCall(callId);

    if (result.success) {
      setCall(result.call);
      setLoading(false);
    } else {
      navigation.goBack();
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <CallContent call={call} />

      <View style={styles.controls}>
        <Text style={styles.name}>{otherUserName}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => videoCallService.toggleCamera(call)}>
            <Text>📹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => videoCallService.toggleMicrophone(call)}>
            <Text>🎤</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => videoCallService.switchCamera(call)}>
            <Text>🔄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.endBtn]}
            onPress={() => navigation.goBack()}>
            <Text>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  controls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  name: { color: '#fff', fontSize: 20, marginBottom: 20 },
  buttons: { flexDirection: 'row', gap: 15 },
  btn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endBtn: { backgroundColor: '#ff3b30' },
});

export default VideoCallScreen;
```

---

## Step 10: Home Screen (Start Call)

### src/screens/HomeScreen.js

```javascript
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { nanoid } from 'nanoid';
import { requestCallPermissions } from '../utils/callPermissions';

const CONTACTS = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
];

const HomeScreen = ({ navigation }) => {
  const startCall = async contact => {
    const hasPermissions = await requestCallPermissions();
    if (!hasPermissions) return;

    navigation.navigate('VideoCall', {
      callId: nanoid(),
      isOutgoing: true,
      otherUserName: contact.name,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <FlatList
        data={CONTACTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contact}
            onPress={() => startCall(item)}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.callBtn}>📹 Call</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  contact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 18 },
  callBtn: { fontSize: 16, color: '#4285F4' },
});

export default HomeScreen;
```

---

## Step 11: Initialize Stream in App.js

```javascript
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import {
  initializeStreamClient,
  disconnectStreamClient,
} from './src/config/streamConfig';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return auth().onAuthStateChanged(async userState => {
      setUser(userState);
      if (userState) {
        await initializeStreamClient();
      } else {
        await disconnectStreamClient();
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="VideoCall"
              component={VideoCallScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## Step 12: Build & Run

### Android

```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### iOS

```bash
cd ios && pod install && cd ..
npm run ios
```

### Start Backend

```bash
cd allio-backend
node server.js
```

---

## Testing Checklist

- [ ] Backend server running on port 3000
- [ ] Login with Firebase Auth
- [ ] Permissions granted for camera/mic
- [ ] Start call from Home screen
- [ ] Video/audio transmission working
- [ ] Camera toggle on/off
- [ ] Microphone toggle on/off
- [ ] Switch camera (front/back)
- [ ] End call functionality

---

## Troubleshooting

| Issue             | Solution                                     |
| ----------------- | -------------------------------------------- |
| Video not showing | Check permissions, test on real device       |
| Connection fails  | Verify backend running, check API keys       |
| App crashes       | Clean build: `cd android && ./gradlew clean` |
| iOS build fails   | `cd ios && pod install`                      |

---

## Production Deployment

1. **Update Backend URL** in `streamConfig.js`:

   ```javascript
   const BACKEND_URL = 'https://api.yourapp.com';
   ```

2. **Deploy Backend** to Heroku/AWS/Vercel

3. **ProGuard Rules** (`android/app/proguard-rules.pro`):
   ```pro
   -keep class org.webrtc.** { *; }
   -keep class io.getstream.** { *; }
   ```

---

## Resources

- **GetStream Docs:** https://getstream.io/video/docs/
- **React Native WebRTC:** https://github.com/react-native-webrtc/react-native-webrtc
- **Stream React Native SDK:** https://getstream.io/video/sdk/react-native/

---

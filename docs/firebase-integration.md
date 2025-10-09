# Firebase Integration

## Overview
This document provides step-by-step instructions for integrating Firebase into the Allio React Native application.

## Prerequisites
- Node.js >= 18
- React Native 0.76.7
- Firebase project created in Firebase Console
- Android Studio for Android
- Xcode for iOS

## Dependencies Used
```json
"@react-native-firebase/app": "23.4.0"
"@react-native-firebase/auth": "23.4.0"
"@react-native-firebase/firestore": "23.4.0"
"@react-native-firebase/messaging": "23.4.0"
"@react-native-firebase/analytics": "23.4.0"
"@react-native-firebase/crashlytics": "23.4.0"
"@react-native-firebase/perf": "23.4.0"
"@react-native-firebase/remote-config": "^23.3.0"
```

## Step 1: Install Firebase Packages
All Firebase packages are already added to package.json. If starting fresh, install them:

```bash
npm install @react-native-firebase/app@23.4.0
npm install @react-native-firebase/auth@23.4.0
npm install @react-native-firebase/firestore@23.4.0
npm install @react-native-firebase/messaging@23.4.0
npm install @react-native-firebase/analytics@23.4.0
npm install @react-native-firebase/crashlytics@23.4.0
npm install @react-native-firebase/perf@23.4.0
npm install @react-native-firebase/remote-config@23.3.0
```

## Step 2: Firebase Console Setup

### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Enter project name: "Allio"
4. Enable Google Analytics (recommended)
5. Click "Create Project"

### Add Android App
1. Click on Android icon in Firebase Console
2. Register app with package name (e.g., com.allio)
3. Download google-services.json
4. Place it in android/app/ directory

### Add iOS App
1. Click on iOS icon in Firebase Console
2. Register app with bundle ID (e.g., com.allio)
3. Download GoogleService-Info.plist
4. Place it in ios/Allio/ directory

## Step 3: Android Configuration

### Update android/build.gradle
```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 21
        compileSdkVersion = 34
        targetSdkVersion = 34
        ndkVersion = "26.1.10909125"
        kotlinVersion = "1.9.22"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.1.1")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
        classpath("com.google.gms:google-services:4.4.0")
        classpath("com.google.firebase:firebase-crashlytics-gradle:2.9.9")
    }
}
```

### Update android/app/build.gradle
Add at the top after other apply statements:
```gradle
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"
apply plugin: "com.google.gms.google-services"
apply plugin: "com.google.firebase.crashlytics"
```

Add Firebase BOM in dependencies section:
```gradle
dependencies {
    implementation platform("com.google.firebase:firebase-bom:32.7.0")
    implementation "com.google.firebase:firebase-analytics"
    implementation "com.google.firebase:firebase-crashlytics"
    implementation "com.google.firebase:firebase-perf"
}
```

## Step 4: iOS Configuration

### Update ios/Podfile
```ruby
platform :ios, '13.4'

target 'Allio' do
  config = use_native_modules!
  
  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => false
  )
  
  # Firebase pods will be auto-linked
  
  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.4'
      end
    end
  end
end
```

### Install iOS Pods
```bash
cd ios
pod install
cd ..
```

### Update ios/Allio/AppDelegate.mm
```objc
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  
  self.moduleName = "Allio";
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
```

## Step 5: Initialize Firebase in React Native

### Create Firebase Config File
Create file: src/config/firebase.js
```javascript
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import remoteConfig from '@react-native-firebase/remote-config';

// Firebase will be auto-initialized with google-services.json and GoogleService-Info.plist

export const firebaseApp = firebase;
export const firebaseAuth = auth;
export const firebaseFirestore = firestore;
export const firebaseMessaging = messaging;
export const firebaseAnalytics = analytics;
export const firebaseCrashlytics = crashlytics;
export const firebasePerf = perf;
export const firebaseRemoteConfig = remoteConfig;

// Initialize Remote Config with default values
export const initializeRemoteConfig = async () => {
  await remoteConfig().setDefaults({
    maintenance_mode: false,
    min_app_version: '1.0.0',
  });
  
  await remoteConfig().fetchAndActivate();
};

// Enable Crashlytics
crashlytics().setCrashlyticsCollectionEnabled(true);

export default firebase;
```

## Step 6: Enable Firebase Services in Console

### Authentication
1. Go to Firebase Console > Authentication
2. Click "Get Started"
3. Enable Email/Password sign-in method
4. Enable Google sign-in method
5. Enable Facebook sign-in method

### Firestore Database
1. Go to Firebase Console > Firestore Database
2. Click "Create Database"
3. Select "Start in production mode"
4. Choose database location
5. Click "Enable"

### Cloud Messaging
1. Go to Firebase Console > Cloud Messaging
2. Note the Server Key for push notifications
3. For iOS, upload APNs certificates

### Analytics
Automatically enabled when Firebase is initialized

### Crashlytics
Automatically enabled with configuration

### Performance Monitoring
Automatically enabled with configuration

## Step 7: Test Firebase Integration

### Create Test Component
Create file: src/screens/FirebaseTestScreen.js
```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { firebaseAuth, firebaseFirestore, firebaseAnalytics } from '../config/firebase';

const FirebaseTestScreen = () => {
  const [status, setStatus] = useState('Testing Firebase...');

  useEffect(() => {
    testFirebase();
  }, []);

  const testFirebase = async () => {
    try {
      // Test Firestore
      const testDoc = await firebaseFirestore()
        .collection('test')
        .doc('testDoc')
        .set({ test: true, timestamp: new Date() });
      
      // Test Analytics
      await firebaseAnalytics().logEvent('firebase_test', {
        test: 'success',
      });
      
      setStatus('Firebase is working correctly!');
    } catch (error) {
      setStatus('Firebase test failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
      <Button title="Test Again" onPress={testFirebase} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default FirebaseTestScreen;
```

## Step 8: Build and Run

### Android
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS
```bash
cd ios
pod install
cd ..
npm run ios
```

## Troubleshooting

### Common Issues

#### Build fails on Android
- Ensure google-services.json is in android/app/
- Clean and rebuild: npm run clean:android
- Check Gradle version compatibility

#### Build fails on iOS
- Ensure GoogleService-Info.plist is in ios/Allio/
- Clean and rebuild: npm run clean:ios
- Check CocoaPods version: pod --version

#### Firebase not initializing
- Check package names match in Firebase Console
- Verify configuration files are in correct locations
- Check internet connectivity

## Security Rules

### Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /chats/{chatId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Best Practices
1. Never commit google-services.json or GoogleService-Info.plist to public repositories
2. Use Firebase Security Rules to protect data
3. Enable Crashlytics for production builds
4. Monitor Analytics for user behavior
5. Use Remote Config for feature flags
6. Implement proper error handling
7. Test on both platforms before deployment

## Additional Resources
- Firebase Documentation: https://firebase.google.com/docs
- React Native Firebase: https://rnfirebase.io
- Firebase Console: https://console.firebase.google.com
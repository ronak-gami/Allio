# Firebase Modules Implementation Guide

**Project:** Allio React Native App

## 🎯 **Overview**

This guide provides comprehensive instructions for implementing Firebase modules in React Native, including Analytics, Crashlytics, Performance Monitoring, Authentication, and Cloud Messaging.

## 📦 **Step 1: Firebase Setup & Installation**

### Install Firebase Dependencies

```bash
# Install core Firebase
npm install @react-native-firebase/app

# Install specific Firebase modules
npm install @react-native-firebase/analytics
npm install @react-native-firebase/crashlytics
npm install @react-native-firebase/perf
npm install @react-native-firebase/auth
npm install @react-native-firebase/messaging

# For iOS, install pods
cd ios && pod install && cd ..
```

## 🔧 **Step 2: Android Configuration**

### Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Add Android app to your Firebase project
4. Download `google-services.json`

### Android Files Configuration

1. **Place google-services.json**

   ```
   android/app/google-services.json
   ```

2. **Update android/build.gradle**

   ```gradle
   buildscript {
     dependencies {
       // Add these lines
       classpath 'com.google.gms:google-services:4.4.0'
       classpath 'com.google.firebase:firebase-crashlytics-gradle:2.9.9'
       classpath 'com.google.firebase:perf-plugin:1.4.2'
     }
   }
   ```

3. **Update android/app/build.gradle**

   ```gradle
   // Add at the top
   apply plugin: 'com.google.gms.google-services'
   apply plugin: 'com.google.firebase.crashlytics'
   apply plugin: 'com.google.firebase.firebase-perf'

   android {
     compileSdkVersion rootProject.ext.compileSdkVersion

     defaultConfig {
       // Add this line for better crash reporting
       multiDexEnabled true
     }
   }

   dependencies {
     // Add if using multidex
     implementation 'androidx.multidex:multidex:2.0.1'
   }
   ```

---

## 🔥 **Step 4: Create Firebase Service**

```typescript name=src/services/FirebaseService.ts
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export interface UserProperties {
  user_id?: string;
  app_version?: string;
  platform?: string;
  device_model?: string;
  [key: string]: string | number | undefined;
}

export interface AnalyticsEvent {
  name: string;
  parameters?: { [key: string]: any };
}

export class FirebaseService {
  // ==================== ANALYTICS METHODS ====================

  /**
   * Log custom analytics event
   */
  static async logEvent(eventName: string, parameters?: object): Promise<void> {
    try {
      await analytics().logEvent(eventName, parameters);
      console.log(`Analytics event logged: ${eventName}`, parameters);
    } catch (error) {
      console.error('Analytics log event error:', error);
      this.logCrash(new Error(`Analytics event error: ${error.message}`));
    }
  }

  /**
   * Log screen view
   */
  static async logScreenView(
    screenName: string,
    screenClass?: string,
  ): Promise<void> {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
      console.log(`Screen view logged: ${screenName}`);
    } catch (error) {
      console.error('Analytics screen view error:', error);
    }
  }

  /**
   * Set user properties for analytics
   */
  static async setUserProperties(properties: UserProperties): Promise<void> {
    try {
      await analytics().setUserProperties(properties);
      console.log('User properties set:', properties);
    } catch (error) {
      console.error('Set user properties error:', error);
    }
  }

  /**
   * Set user ID for analytics
   */
  static async setUserId(userId: string): Promise<void> {
    try {
      await analytics().setUserId(userId);
      await crashlytics().setUserId(userId);
      console.log('User ID set:', userId);
    } catch (error) {
      console.error('Set user ID error:', error);
    }
  }

  /**
   * Log purchase event
   */
  static async logPurchase(
    value: number,
    currency: string,
    items?: any[],
  ): Promise<void> {
    try {
      await analytics().logEvent('purchase', {
        currency: currency,
        value: value,
        items: items,
      });
      console.log(`Purchase logged: ${value} ${currency}`);
    } catch (error) {
      console.error('Log purchase error:', error);
    }
  }

  // ==================== CRASHLYTICS METHODS ====================

  /**
   * Record error in Crashlytics
   */
  static async logCrash(error: Error): Promise<void> {
    try {
      crashlytics().recordError(error);
      console.log('Error recorded in Crashlytics:', error.message);
    } catch (err) {
      console.error('Crashlytics record error failed:', err);
    }
  }

  /**
   * Log non-fatal error
   */
  static async logNonFatal(error: string | Error): Promise<void> {
    try {
      const errorObj = typeof error === 'string' ? new Error(error) : error;
      crashlytics().log(errorObj.message);
      crashlytics().recordError(errorObj);
    } catch (err) {
      console.error('Log non-fatal error failed:', err);
    }
  }

  /**
   * Set custom key for crash reports
   */
  static async setCrashKey(
    key: string,
    value: string | number | boolean,
  ): Promise<void> {
    try {
      crashlytics().setAttribute(key, value.toString());
      console.log(`Crash key set: ${key} = ${value}`);
    } catch (error) {
      console.error('Set crash key error:', error);
    }
  }

  /**
   * Set user identifier for crash reports
   */
  static async setCrashUserId(userId: string): Promise<void> {
    try {
      crashlytics().setUserId(userId);
      console.log('Crash user ID set:', userId);
    } catch (error) {
      console.error('Set crash user ID error:', error);
    }
  }

  /**
   * Log custom message to crash reports
   */
  static async logCrashMessage(message: string): Promise<void> {
    try {
      crashlytics().log(message);
      console.log('Crash message logged:', message);
    } catch (error) {
      console.error('Log crash message error:', error);
    }
  }

  // ==================== PERFORMANCE MONITORING ====================

  /**
   * Start performance trace
   */
  static async startTrace(traceName: string): Promise<any> {
    try {
      const trace = perf().newTrace(traceName);
      await trace.start();
      console.log(`Performance trace started: ${traceName}`);
      return trace;
    } catch (error) {
      console.error('Start performance trace error:', error);
      return null;
    }
  }

  /**
   * Stop performance trace
   */
  static async stopTrace(trace: any): Promise<void> {
    try {
      if (trace) {
        await trace.stop();
        console.log('Performance trace stopped');
      }
    } catch (error) {
      console.error('Stop performance trace error:', error);
    }
  }

  /**
   * Add custom metric to trace
   */
  static async addTraceMetric(
    trace: any,
    metricName: string,
    value: number,
  ): Promise<void> {
    try {
      if (trace) {
        trace.putMetric(metricName, value);
        console.log(`Trace metric added: ${metricName} = ${value}`);
      }
    } catch (error) {
      console.error('Add trace metric error:', error);
    }
  }

  /**
   * Create HTTP metric
   */
  static async createHttpMetric(url: string, method: string): Promise<any> {
    try {
      const metric = perf().newHttpMetric(url, method);
      console.log(`HTTP metric created: ${method} ${url}`);
      return metric;
    } catch (error) {
      console.error('Create HTTP metric error:', error);
      return null;
    }
  }

  /**
   * Start HTTP metric
   */
  static async startHttpMetric(metric: any): Promise<void> {
    try {
      if (metric) {
        await metric.start();
        console.log('HTTP metric started');
      }
    } catch (error) {
      console.error('Start HTTP metric error:', error);
    }
  }

  /**
   * Stop HTTP metric
   */
  static async stopHttpMetric(
    metric: any,
    responseCode?: number,
    responseSize?: number,
  ): Promise<void> {
    try {
      if (metric) {
        if (responseCode) metric.setHttpResponseCode(responseCode);
        if (responseSize) metric.setResponseContentType('application/json');
        await metric.stop();
        console.log('HTTP metric stopped');
      }
    } catch (error) {
      console.error('Stop HTTP metric error:', error);
    }
  }

  // ==================== AUTHENTICATION METHODS ====================

  /**
   * Get current user
   */
  static getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  /**
   * Sign out user
   */
  static async signOut(): Promise<void> {
    try {
      await auth().signOut();
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChanged(
    callback: (user: FirebaseAuthTypes.User | null) => void,
  ): () => void {
    return auth().onAuthStateChanged(callback);
  }

  // ==================== MESSAGING METHODS ====================

  /**
   * Request notification permission
   */
  static async requestNotificationPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log('Notification permission status:', authStatus);
      return enabled;
    } catch (error) {
      console.error('Request notification permission error:', error);
      return false;
    }
  }

  /**
   * Get FCM token
   */
  static async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Get FCM token error:', error);
      return null;
    }
  }

  // ==================== INITIALIZATION ====================

  /**
   * Initialize Firebase services
   */
  static async initialize(): Promise<void> {
    try {
      // Enable crashlytics collection
      await crashlytics().setCrashlyticsCollectionEnabled(true);

      // Set initial user properties
      await this.setUserProperties({
        app_version: '1.0.0', // Replace with actual version
        platform: Platform.OS,
        device_model: Platform.OS === 'ios' ? 'iOS Device' : 'Android Device',
      });

      // Log app initialization
      await this.logEvent('app_initialize', {
        timestamp: Date.now(),
        platform: Platform.OS,
      });

      console.log('Firebase services initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }
}

// Predefined analytics events
export const AnalyticsEvents = {
  APP_OPEN: 'app_open',
  LOGIN: 'login',
  SIGN_UP: 'sign_up',
  SCREEN_VIEW: 'screen_view',
  BUTTON_CLICK: 'button_click',
  BIOMETRIC_AUTH_SUCCESS: 'biometric_auth_success',
  BIOMETRIC_AUTH_FAILED: 'biometric_auth_failed',
  MPIN_AUTH_SUCCESS: 'mpin_auth_success',
  THEME_CHANGED: 'theme_changed',
  LANGUAGE_CHANGED: 'language_changed',
  NOTIFICATION_RECEIVED: 'notification_received',
  NOTIFICATION_CLICKED: 'notification_clicked',
};
```

---

## 🚀 **Step 5: App Integration**

```typescript name=src/App.tsx
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { FirebaseService, AnalyticsEvents } from './src/services/FirebaseService';
import messaging from '@react-native-firebase/messaging';

export default function App() {

  useEffect(() => {
    initializeApp();
    setupNotificationHandlers();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize Firebase services
      await FirebaseService.initialize();

      // Log app open event
      await FirebaseService.logEvent(AnalyticsEvents.APP_OPEN, {
        timestamp: Date.now(),
        session_start: true,
      });

      // Request notification permissions
      const hasPermission = await FirebaseService.requestNotificationPermission();
      if (hasPermission) {
        const fcmToken = await FirebaseService.getFCMToken();
        if (fcmToken) {
          console.log('FCM Token received:', fcmToken);
          // Send token to your server
        }
      }

    } catch (error) {
      console.error('App initialization error:', error);
      FirebaseService.logCrash(new Error(`App init failed: ${error.message}`));
    }
  };

  const setupNotificationHandlers = () => {
    // Handle foreground notifications
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification:', remoteMessage);
      await FirebaseService.logEvent(AnalyticsEvents.NOTIFICATION_RECEIVED, {
        notification_id: remoteMessage.messageId,
        foreground: true,
      });
    });

    // Handle background/quit state notifications
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      FirebaseService.logEvent(AnalyticsEvents.NOTIFICATION_CLICKED, {
        notification_id: remoteMessage.messageId,
        from_background: true,
      });
    });

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
          FirebaseService.logEvent(AnalyticsEvents.NOTIFICATION_CLICKED, {
            notification_id: remoteMessage.messageId,
            from_quit_state: true,
          });
        }
      });
  };

  return (
    // Your app components
  );
}
```

---

## 📊 **Step 6: Usage Examples**

### Analytics Implementation

```typescript name=src/hooks/useAnalytics.ts

```

## 🧪 **Step 7: Testing & Validation**

### Test Analytics Events

```bash
# Install Firebase CLI for testing
npm install -g firebase-tools

# Login to Firebase
firebase login

# Test analytics events (Android)
adb shell setprop debug.firebase.analytics.app YOUR_PACKAGE_NAME

# View real-time analytics
# Go to Firebase Console > Analytics > DebugView
```

### Test Crashlytics

```typescript
// Add test crash button in debug mode
import crashlytics from '@react-native-firebase/crashlytics';

const TestCrashButton = () => {
  const testCrash = () => {
    crashlytics().crash();
  };

  return __DEV__ ? <Button title="Test Crash" onPress={testCrash} /> : null;
};
```

### Performance Testing

```typescript
// Test performance traces
const TestPerformance = () => {
  const testTrace = async () => {
    const trace = await FirebaseService.startTrace('test_operation');

    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 2000));

    await FirebaseService.addTraceMetric(trace, 'items_processed', 100);
    await FirebaseService.stopTrace(trace);
  };

  return <Button title="Test Performance" onPress={testTrace} />;
};
```

## 📋 **Implementation Checklist**

- [ ] Install Firebase packages
- [ ] Configure Android (google-services.json, build.gradle)
- [ ] Configure iOS (GoogleService-Info.plist, Podfile)
- [ ] Create FirebaseService class
- [ ] Initialize Firebase in App.tsx
- [ ] Implement Analytics tracking
- [ ] Set up Crashlytics error reporting
- [ ] Configure Performance monitoring
- [ ] Test on both platforms
- [ ] Verify Firebase Console data
- [ ] Set up notification handlers
- [ ] Configure user properties
- [ ] Test crash reporting
- [ ] Validate performance traces

## 🔧 **Troubleshooting**

### Common Issues

1. **Android Build Errors**

   ```bash
   # Clean and rebuild
   cd android && ./gradlew clean && cd ..
   npx react-native run-android
   ```

2. **Analytics Not Showing**

   - Enable DebugView in Firebase Console
   - Check internet connection
   - Verify google-services.json/GoogleService-Info.plist

3. **Crashlytics Not Working**
   - Ensure Crashlytics is enabled in Firebase Console
   - Check if crash collection is enabled
   - Test with intentional crash

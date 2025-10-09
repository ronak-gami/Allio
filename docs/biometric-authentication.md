# Biometric Authentication Implementation Guide

**Project:** Allio React Native App   

---

## 🎯 **Overview**

This guide provides step-by-step instructions for implementing biometric authentication (Fingerprint/Face ID) in React Native using the `react-native-biometrics` library, with MPIN fallback functionality.

---

## 📦 **Step 1: Installation**

### Install Required Dependencies

```bash
# Install react-native-biometrics
npm install react-native-biometrics

# For iOS, install pods
cd ios && pod install && cd ..

# For React Native 0.60+, auto-linking should handle the rest
# For older versions, you may need manual linking
```

---

## ⚙️ **Step 2: Platform Configuration**

### Android Configuration

Add permissions to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
  
  <!-- Biometric permissions -->
  <uses-permission android:name="android.permission.USE_FINGERPRINT" />
  <uses-permission android:name="android.permission.USE_BIOMETRIC" />
  
  <application>
    <!-- Your app configuration -->
  </application>
</manifest>
```


---

## 🔧 **Step 3: Create Biometric Service**

```typescript name=src/services/BiometricService.ts
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

export interface BiometricSupportResult {
  isSupported: boolean;
  type: BiometryTypes | null;
  error?: string;
}

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export class BiometricService {
  private rnBiometrics: ReactNativeBiometrics;

  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });
  }

  /**
   * Check if device supports biometric authentication
   */
  async checkBiometricSupport(): Promise<BiometricSupportResult> {
    try {
      const { available, biometryType } = await this.rnBiometrics.isSensorAvailable();
      
      return {
        isSupported: available,
        type: biometryType, // 'TouchID', 'FaceID', 'Biometrics'
      };
    } catch (error) {
      console.error('Biometric support check error:', error);
      return { 
        isSupported: false, 
        type: null, 
        error: error.message 
      };
    }
  }

  /**
   * Create biometric keys for secure authentication
   */
  async createBiometricKeys(): Promise<string | null> {
    try {
      const { publicKey } = await this.rnBiometrics.createKeys();
      console.log('Biometric keys created successfully');
      return publicKey;
    } catch (error) {
      console.error('Create biometric keys error:', error);
      return null;
    }
  }

  /**
   * Authenticate user with biometrics
   */
  async authenticateWithBiometrics(customMessage?: string): Promise<BiometricAuthResult> {
    try {
      const { success } = await this.rnBiometrics.simplePrompt({
        promptMessage: customMessage || 'Please authenticate to continue',
        cancelButtonText: 'Cancel',
      });
      
      return { success };
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Create signature with biometric authentication
   */
  async createSignature(payload: string): Promise<{ success: boolean; signature?: string }> {
    try {
      const { success, signature } = await this.rnBiometrics.createSignature({
        promptMessage: 'Please authenticate to sign the data',
        payload: payload,
      });
      
      return { success, signature };
    } catch (error) {
      console.error('Create signature error:', error);
      return { success: false };
    }
  }

  /**
   * Delete biometric keys
   */
  async deleteBiometricKeys(): Promise<boolean> {
    try {
      const { keysDeleted } = await this.rnBiometrics.deleteKeys();
      console.log('Biometric keys deleted:', keysDeleted);
      return keysDeleted;
    } catch (error) {
      console.error('Delete biometric keys error:', error);
      return false;
    }
  }

  /**
   * Check if biometric keys exist
   */
  async biometricKeysExist(): Promise<boolean> {
    try {
      const { keysExist } = await this.rnBiometrics.biometricKeysExist();
      return keysExist;
    } catch (error) {
      console.error('Check biometric keys error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const biometricService = new BiometricService();
```

---

## 📱 **Step 4: Create Biometric Authentication Screen**

```typescript name=src/screens/auth/BiometricAuthScreen.tsx


---

## 🔄 **Step 5: Integration with App Flow**

```typescript name=src/navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BiometricAuthScreen } from '../screens/auth/BiometricAuthScreen';
import { MPINScreen } from '../screens/auth/MPINScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' }
      }}
    >
      <Stack.Screen 
        name="BiometricAuth" 
        component={BiometricAuthScreen} 
      />
      <Stack.Screen 
        name="MPINScreen" 
        component={MPINScreen} 
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
      />
    </Stack.Navigator>
  );
};
```

---

## 🧪 **Step 6: Testing Guidelines**

### Test Cases

1. **Device Support Check**
   - Test on devices with Face ID
   - Test on devices with Touch ID  
   - Test on devices with Android fingerprint
   - Test on devices without biometric support

2. **Authentication Flow**
   - Successful biometric authentication
   - Failed biometric authentication
   - Cancelled biometric authentication
   - Multiple failed attempts triggering MPIN fallback

3. **Key Management**
   - Initial key creation
   - Key existence verification
   - Key deletion and recreation

### Testing Commands

```bash
# Run on iOS simulator (limited biometric testing)
npx react-native run-ios

# Run on Android emulator with fingerprint
npx react-native run-android

# Run on physical devices for full biometric testing
```

---

## 🔧 **Step 7: Troubleshooting**

### Common Issues

1. **BiometricError: User canceled**
   - User cancelled the biometric prompt
   - Handle gracefully with retry option

2. **BiometricError: Authentication failed**
   - Biometric didn't match
   - Implement attempt counter

3. **iOS: Face ID not available**
   - Check Info.plist configuration
   - Ensure NSFaceIDUsageDescription is present

4. **Android: Fingerprint hardware not available**
   - Check device compatibility
   - Verify permissions in AndroidManifest.xml

### Debug Tips

```typescript
// Enable detailed logging
console.log('Biometric support check result:', result);

// Test key operations
const keysExist = await biometricService.biometricKeysExist();
console.log('Keys exist:', keysExist);
```

---

## 📋 **Implementation Checklist**

- [ ] Install react-native-biometrics package
- [ ] Configure Android permissions
- [ ] Configure iOS Face ID usage description
- [ ] Create BiometricService class
- [ ] Implement BiometricAuthScreen component
- [ ] Add MPIN fallback functionality
- [ ] Integrate with navigation flow
- [ ] Test on physical devices
- [ ] Handle error cases gracefully
- [ ] Add attempt limiting
- [ ] Implement secure key management

---

## 🎯 **Best Practices**

1. **Security**
   - Never store sensitive data with biometric keys
   - Use signature-based authentication for critical operations
   - Implement proper key rotation

2. **User Experience**
   - Provide clear error messages
   - Offer alternative authentication methods
   - Don't force biometric authentication

3. **Performance**
   - Cache biometric support check results
   - Minimize biometric prompt delays
   - Handle background/foreground transitions

---


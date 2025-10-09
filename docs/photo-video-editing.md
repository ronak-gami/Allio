# PhotoMedia Image and Video Manipulation Implementation Guide

**Project:** Allio  
**Branch:** features/rg/deep-linking  

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Dependencies Setup](#dependencies-setup)
4. [Project Structure](#project-structure)
5. [Implementation Steps](#implementation-steps)
6. [Code Implementation](#code-implementation)
7. [Platform Configuration](#platform-configuration)
8. [Testing & Debugging](#testing--debugging)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Project Overview

This guide provides step-by-step implementation for PhotoMedia functionality in the Allio app using Imagly SDK. The implementation includes:

- **Image Editing**: Filters, cropping, adjustments, text overlay
- **Video Editing**: Trimming, filters, effects, text overlay  
- **Media Selection**: Camera capture and gallery selection
- **Deep Linking**: Integration with existing deep linking system
- **Cross-Platform**: iOS and Android support

**Target Branch:** `features/rg/deep-linking`  
**Repository:** ronak-gami/Allio

## Prerequisites

### Development Environment
```bash
# Verify React Native setup
npx react-native doctor

# Check versions
node --version    # >=18.0.0
npm --version     # >=8.0.0
```

### Branch Setup
```bash
# Clone and checkout branch
git clone https://github.com/ronak-gami/Allio.git
cd Allio
git checkout features/rg/deep-linking
git pull origin features/rg/deep-linking
```

## Dependencies Setup

### Core Dependencies
```bash
# Imagly SDK
npm install @imgly/photoeditorsdk-react-native@11.7.0
npm install @imgly/vesdk-react-native@11.7.0

# Media handling
npm install react-native-image-picker@7.1.0
npm install react-native-video@6.0.0
npm install react-native-fs@2.20.0

# UI & Navigation
npm install react-native-vector-icons@10.0.0
npm install react-native-modal@13.0.1
npm install @react-navigation/native@6.1.7

# Utilities
npm install react-native-permissions@3.8.0
npm install @react-native-async-storage/async-storage@1.19.0
```

### Link Dependencies
```bash
# iOS
cd ios && pod install && cd ..

# Android - Auto-linking should handle most dependencies
npx react-native run-android
```

## Project Structure

```
src/
├── components/
│   └── PhotoMedia/
│       ├── PhotoMediaScreen.js          # Main screen component
│       ├── MediaPicker.js               # Camera/Gallery picker
│       ├── ImageEditor.js               # Image editing interface
│       ├── VideoEditor.js               # Video editing interface
│       └── components/
│           ├── EditingToolbar.js        # Editing controls
│           ├── FilterPanel.js           # Filter selection
│           └── SaveModal.js             # Save/Share options
├── services/
│   ├── ImaglyService.js                 # Imagly SDK integration
│   ├── MediaService.js                  # Media utilities
│   └── PermissionService.js             # Permission handling
├── config/
│   └── imaglyConfig.js                  # Imagly configuration
├── utils/
│   ├── mediaUtils.js                    # Media helper functions
│   └── constants.js                     # App constants
├── navigation/
│   └── PhotoMediaNavigator.js           # Navigation setup
└── styles/
    └── PhotoMediaStyles.js              # Styling
```

## Implementation Steps

### Step 1: Create Imagly Configuration

Create `src/config/imaglyConfig.js`:

```javascript
export const IMAGLY_LICENSE = 'YOUR_IMAGLY_LICENSE_KEY_HERE';

export const PHOTO_EDITOR_CONFIG = {
  license: IMAGLY_LICENSE,
  export: {
    image: {
      format: 'jpeg',
      quality: 0.95,
    },
  },
  theme: 'dark',
  // Reference: Imagly PhotoEditor SDK documentation
};

export const VIDEO_EDITOR_CONFIG = {
  license: IMAGLY_LICENSE,
  export: {
    video: {
      format: 'mp4',
      quality: 'high',
    },
  },
  theme: 'dark',
  // Reference: Imagly VideoEditor SDK documentation
};
```

### Step 2: Implement Imagly Service

Create `src/services/ImaglyService.js`:

```javascript
import { PhotoEditorModal, VideoEditorModal } from '@imgly/photoeditorsdk-react-native';
import { PHOTO_EDITOR_CONFIG, VIDEO_EDITOR_CONFIG } from '../config/imaglyConfig';

export class ImaglyService {
  static async editPhoto(imageUri) {
    // Reference: Imagly PhotoEditor implementation
    return await PhotoEditorModal.present(imageUri, PHOTO_EDITOR_CONFIG);
  }

  static async editVideo(videoUri) {
    // Reference: Imagly VideoEditor implementation  
    return await VideoEditorModal.present(videoUri, VIDEO_EDITOR_CONFIG);
  }
}
```

### Step 3: Create Media Picker Component

Create `src/components/PhotoMedia/MediaPicker.js`:

```javascript
import React from 'react';
import ImagePicker from 'react-native-image-picker';
import { PermissionService } from '../../services/PermissionService';

const MediaPicker = ({ onMediaSelected }) => {
  const selectMedia = async () => {
    // 1. Request permissions using PermissionService
    // 2. Configure ImagePicker options
    // 3. Launch picker (camera or gallery)
    // 4. Handle response and call onMediaSelected
    
    // Reference: react-native-image-picker documentation
  };

  // UI implementation with camera/gallery options
};
```

### Step 4: Build Main PhotoMedia Screen

Create `src/components/PhotoMedia/PhotoMediaScreen.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { ImaglyService } from '../../services/ImaglyService';
import MediaPicker from './MediaPicker';

const PhotoMediaScreen = ({ navigation, route }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle deep linking parameters
  useEffect(() => {
    if (route.params?.mediaUri) {
      setSelectedMedia({
        uri: route.params.mediaUri,
        type: route.params.mediaType || 'image'
      });
    }
  }, [route.params]);

  const handleEdit = async () => {
    setIsProcessing(true);
    try {
      const result = selectedMedia.type === 'image'
        ? await ImaglyService.editPhoto(selectedMedia.uri)
        : await ImaglyService.editVideo(selectedMedia.uri);
      
      // Handle editing result
    } catch (error) {
      // Error handling
    } finally {
      setIsProcessing(false);
    }
  };

  // UI implementation with media preview and edit controls
};
```

### Step 5: Create Permission Service

Create `src/services/PermissionService.js`:

```javascript
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform, Alert } from 'react-native';

export class PermissionService {
  static async requestCameraPermission() {
    const permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.CAMERA 
      : PERMISSIONS.ANDROID.CAMERA;
    
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  }

  static async requestGalleryPermission() {
    // Similar implementation for gallery permissions
  }
}
```

## Platform Configuration

### iOS Configuration

**File:** `ios/Podfile`
```ruby
target 'Allio' do
  # Existing pods...
  
  # Imagly SDK
  pod 'PhotoEditorSDK', '~> 11.7'
  pod 'VideoEditorSDK', '~> 11.7'
end
```

**File:** `ios/Allio/Info.plist`
```xml
<key>NSCameraUsageDescription</key>
<string>Access camera to take photos and videos for editing</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Access photo library to select media for editing</string>
<key>NSMicrophoneUsageDescription</key>
<string>Access microphone for video recording</string>
```

**Setup Commands:**
```bash
cd ios
pod install
cd ..
```

### Android Configuration

**File:** `android/app/build.gradle`
```gradle
dependencies {
    // Existing dependencies...
    
    implementation 'ly.img.android:photoeditorsdk:11.7.+'
    implementation 'ly.img.android:vesdk:11.7.+'
}
```

**File:** `android/app/src/main/AndroidManifest.xml`
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Navigation Integration

### Deep Linking Setup

**File:** `src/navigation/PhotoMediaNavigator.js`
```javascript
import { createStackNavigator } from '@react-navigation/stack';
import PhotoMediaScreen from '../components/PhotoMedia/PhotoMediaScreen';

const Stack = createStackNavigator();

export const PhotoMediaNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="PhotoMediaMain" 
      component={PhotoMediaScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);
```

**Integration with existing navigation:**
```javascript
// In your main App.js or navigator
const linking = {
  prefixes: ['allio://'],
  config: {
    screens: {
      PhotoMedia: {
        path: '/photomedia/:mediaUri?/:mediaType?',
        // Reference: @react-navigation/native deep linking docs
      },
    },
  },
};
```

## Testing & Debugging

### Development Testing
```bash
# Run on iOS
npx react-native run-ios --configuration Debug

# Run on Android  
npx react-native run-android --variant=debug

# Reset cache if needed
npx react-native start --reset-cache
```

### Test Cases
1. **Media Selection**
   - Camera capture (photo/video)
   - Gallery selection (photo/video)
   - Permission handling

2. **Image Editing**
   - Apply filters
   - Crop functionality
   - Adjust brightness/contrast
   - Add text overlay

3. **Video Editing**
   - Trim video
   - Apply video filters
   - Add text overlay

4. **Deep Linking**
   - Test URL: `allio://photomedia/path/to/image/image`
   - Test URL: `allio://photomedia/path/to/video/video`

### Debug Commands
```bash
# iOS debugging
npx react-native log-ios

# Android debugging
npx react-native log-android

# Check for issues
npx react-native doctor
```

## Deployment

### Pre-deployment Checklist
- [ ] Imagly license key configured
- [ ] All permissions properly set
- [ ] Tested on physical devices
- [ ] Deep linking tested
- [ ] Error handling implemented
- [ ] Performance optimized

### Build Commands
```bash
# iOS Release
npx react-native run-ios --configuration Release

# Android Release
cd android
./gradlew assembleRelease
```

## Troubleshooting

### Common Issues

**1. Imagly License Error**
```
Solution: Verify license key in src/config/imaglyConfig.js
Check: License validity and SDK version compatibility
```

**2. Permission Denied**
```
Solution: Check platform-specific permission configurations
iOS: Info.plist entries
Android: AndroidManifest.xml permissions
```

**3. Build Errors**
```
Solution: Clean and rebuild
iOS: cd ios && pod install && cd ..
Android: cd android && ./gradlew clean && cd ..
```

**4. Deep Linking Not Working**
```
Solution: Verify navigation configuration
Check: URL schemes in platform config files
Test: Navigation linking setup
```

### Support Resources
- **Imagly Documentation:** https://img.ly/docs
- **React Native Docs:** https://reactnative.dev/docs
- **Repository Issues:** https://github.com/ronak-gami/Allio/issues

## Development Notes

**Current Implementation Status:**
- Base architecture: ✓ Completed
- Imagly integration: 🔄 In Progress
- Deep linking: ✓ Available in branch
- Platform config: 🔄 Needs setup

**Next Steps:**
1. Configure Imagly license
2. Implement core components
3. Test on both platforms
4. Optimize performance
5. Deploy to staging


# BottomSheet Implementation Guide

**Project:** Allio React Native App  
**Version:** 1.0.0

---

## 🎯 **Overview**

This document provides comprehensive instructions for implementing BottomSheet components in the Allio React Native application using `@gorhom/bottom-sheet` library with context management, theme switching, and custom content support.

### Features Implemented

- ✅ Global BottomSheet with context management
- ✅ Custom snap points and dynamic content
- ✅ Theme-aware styling and animations
- ✅ Backdrop with touch-to-close functionality
- ✅ Customizable buttons and actions
- ✅ Redux integration for state management
- ✅ Session management integration

---

## 📦 **Step 1: Dependencies Installation**

### Install Required Packages

```bash
# Install BottomSheet core library
npm install @gorhom/bottom-sheet

# Install required dependencies for animations
npm install react-native-reanimated react-native-gesture-handler

# Install Redux for state management (already installed in project)
npm install @reduxjs/toolkit react-redux

# Install secure storage (already installed)
npm install react-native-mmkv-storage

# For iOS, install pods
cd ios && pod install && cd ..
```

### Current Dependencies in package.json

```json
{
  "@gorhom/bottom-sheet": "^4.6.1",
  "react-native-reanimated": "^3.6.2",
  "react-native-gesture-handler": "^2.14.1",
  "@reduxjs/toolkit": "^1.9.7",
  "react-redux": "^8.1.3",
  "react-native-mmkv-storage": "^0.9.1"
}
```

---

## ⚙️ **Step 2: Platform Configuration**

### Android Configuration

Update `android/app/src/main/java/.../MainActivity.java`:

1. **Import Required Packages**

   - Add gesture handler imports
   - Configure React Activity Delegate
   - Enable gesture handler root view

2. **Update MainActivity Class**
   - Override createReactActivityDelegate method
   - Return RNGestureHandlerEnabledRootView
   - Ensure proper gesture handling

### iOS Configuration

Update `ios/Allio/AppDelegate.mm`:

1. **Pod Installation**

   - Run `cd ios && pod install`
   - Verify gesture handler and reanimated pods
   - Check for any pod conflicts

2. **Build Configuration**
   - Update Xcode project settings
   - Verify linker flags
   - Test gesture recognition

---

## �️ **Step 3: Architecture Overview**

The BottomSheet implementation follows this modular architecture:

```
src/
├── context/
│   └── BottomSheetContext.tsx          # Global BottomSheet state management
├── components/
│   ├── atoms/
│   │   └── GlobalBottomSheet/          # Reusable BottomSheet component
│   │       ├── index.tsx
│   │       └── style.ts
│   └── organisms/
│       ├── ThemeOrganism/              # Theme selection component
│       ├── DeleteProfileOrganism/      # Delete account component
│       └── LogoutOrganism/             # Logout confirmation component
├── screens/
│   └── App/
│       └── More/                       # Settings screen implementation
│           ├── index.tsx
│           └── useMore.ts
├── utils/
│   └── helper.ts                       # Utility functions
└── types/
    └── bottomSheet.ts                  # Type definitions
```

---

## 🎛️ **Step 4: Context Setup**

### BottomSheet Context Configuration

Create comprehensive context for BottomSheet state management:

1. **Context Provider Setup**

   - Create BottomSheetProvider component
   - Initialize refs for bottomSheet and tabBar
   - Setup state management for content and configuration

2. **State Management**

   - Manage snap points dynamically
   - Handle content rendering
   - Control title and button visibility
   - Track open/close states

3. **Context Methods**

   - `openBottomSheet`: Open with custom configuration
   - `closeBottomSheet`: Close and cleanup
   - `updateSnapPoints`: Dynamic snap point updates
   - `setContent`: Update content dynamically

4. **Integration with Navigation**
   - Tab bar visibility control
   - Navigation state handling
   - Screen focus management

---

## 📱 **Step 5: Global BottomSheet Component**

### Core Component Implementation

1. **Component Structure**

   - Header with title and close button
   - Content area for dynamic content
   - Button container for actions
   - Backdrop for touch-to-close

2. **Animation Configuration**

   - Smooth open/close transitions
   - Spring-based animations
   - Backdrop fade effects
   - Handle indicator animations

3. **Snap Points Management**

   - Percentage-based: `['25%', '50%', '75%']`
   - Pixel-based: `[250, 400, 600]`
   - Dynamic: Based on content height
   - Device-specific adjustments

4. **Gesture Handling**
   - Pan down to close
   - Backdrop touch to dismiss
   - Handle drag interactions
   - Keyboard avoidance

---

## 🎨 **Step 6: Styling System**

### Theme Integration

1. **Dynamic Theming**

   - Light and dark theme support
   - Color scheme management
   - Typography consistency
   - Icon and image theming

2. **Responsive Design**

   - Screen size adaptations
   - Orientation handling
   - Device-specific styling
   - Accessibility considerations

3. **Platform Styling**

   - iOS-specific styles
   - Android material design
   - Platform-specific animations
   - Native look and feel

4. **Style Configuration**
   - Border radius for modern look
   - Shadow and elevation effects
   - Spacing and padding consistency
   - Color contrast compliance

---

## � **Step 7: Organism Components**

### Theme Selection Organism

1. **Theme Options**

   - Light theme selection
   - Dark theme selection
   - System default option (future)
   - Visual theme previews

2. **State Management**

   - Redux integration for theme state
   - Persistent theme storage
   - Immediate theme application
   - State synchronization

3. **User Interaction**
   - Radio button selection
   - Apply button confirmation
   - Cancel option
   - Visual feedback

### Confirmation Organisms

1. **Logout Organism**

   - Security confirmation dialog
   - Session cleanup handling
   - Navigation to auth screens
   - Biometric re-authentication

2. **Delete Profile Organism**

   - Account deletion warnings
   - Data cleanup notifications
   - Irreversible action alerts
   - Security verification steps

3. **Action Buttons**
   - Primary action styling
   - Secondary cancel options
   - Disabled state handling
   - Loading state indicators

---

## ⚙️ **Step 8: Settings Integration**

### Settings Screen Setup

1. **Menu Configuration**

   - Dynamic settings list
   - Icon and title setup
   - Action type definitions
   - Conditional item rendering

2. **BottomSheet Triggers**

   - Touch handlers for menu items
   - Configuration passing
   - State management
   - Error handling

3. **Settings Categories**

   - Appearance settings (Theme)
   - Account settings (Logout, Delete)
   - Notification preferences
   - Security options

4. **Integration Points**
   - Redux store connection
   - Navigation service integration
   - Authentication state checking
   - Permission handling

---

## 🧪 **Step 9: Testing Guidelines**

### Component Testing

1. **Unit Tests**

   - Context functionality
   - Component rendering
   - State management
   - Method execution

2. **Integration Tests**

   - BottomSheet opening/closing
   - Theme switching flow
   - Settings navigation
   - Redux state updates

3. **UI Testing**

   - Gesture interactions
   - Animation smoothness
   - Responsive behavior
   - Accessibility compliance

4. **Platform Testing**
   - iOS behavior verification
   - Android functionality
   - Different screen sizes
   - Orientation changes

### Testing Commands

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run on simulators
npx react-native run-ios
npx react-native run-android

# Performance testing
npx react-native start --reset-cache

# Build for testing
npm run build:test
```

---

## 🔧 **Step 10: Troubleshooting**

### Common Setup Issues

1. **Gesture Handler Configuration**

   - Verify MainActivity.java setup
   - Check iOS project configuration
   - Test gesture recognition
   - Debug gesture conflicts

2. **Animation Problems**

   - Reanimated library setup
   - iOS/Android configuration
   - Performance optimization
   - Memory leak prevention

3. **State Management Issues**

   - Context provider placement
   - Redux store configuration
   - Action dispatching
   - State persistence

4. **Styling Problems**
   - Theme integration
   - Platform-specific styles
   - Responsive design
   - Dark mode support

### Debug Tools

1. **Development Tools**

   - React Native Debugger
   - Flipper integration
   - Performance monitor
   - Memory profiler

2. **Logging and Monitoring**
   - Console debugging
   - Error boundary implementation
   - Crash reporting
   - Performance metrics

---

## 📋 **Implementation Checklist**

### Initial Setup

- [ ] Install required dependencies
- [ ] Configure platform-specific files
- [ ] Setup gesture handlers
- [ ] Test basic animations

### Core Implementation

- [ ] Create BottomSheet context
- [ ] Implement GlobalBottomSheet component
- [ ] Setup styling system
- [ ] Configure theme integration

### Feature Development

- [ ] Build organism components
- [ ] Integrate with settings screen
- [ ] Setup Redux connections
- [ ] Implement error handling

### Testing & Optimization

- [ ] Write unit tests
- [ ] Perform integration testing
- [ ] Optimize performance
- [ ] Test accessibility

### Deployment Preparation

- [ ] Build for production
- [ ] Test on physical devices
- [ ] Performance validation
- [ ] Documentation completion

---

## 🎯 **Best Practices**

### Performance Optimization

- ✅ Use `useMemo` for expensive computations
- ✅ Implement `useCallback` for event handlers
- ✅ Optimize component re-renders
- ✅ Lazy load heavy components
- ✅ Monitor memory usage

### State Management

- ✅ Use Context for component-specific state
- ✅ Integrate Redux for global state
- ✅ Implement proper cleanup
- ✅ Handle async operations
- ✅ Maintain state consistency

### User Experience

- ✅ Smooth animations
- ✅ Intuitive gestures
- ✅ Clear visual feedback
- ✅ Accessibility support
- ✅ Error state handling

### Code Quality

- ✅ TypeScript implementation
- ✅ Consistent naming conventions
- ✅ Proper error boundaries
- ✅ Component documentation
- ✅ Unit test coverage

---

## 📚 **Additional Resources**

- [Gorhom BottomSheet Documentation](https://gorhom.github.io/react-native-bottom-sheet/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- [Redux Toolkit Best Practices](https://redux-toolkit.js.org/usage/usage-guide)

---

## 📝 **Changelog**

### Version 1.0.0 (October 2025)

- ✅ Initial BottomSheet implementation
- ✅ Context-based state management
- ✅ Theme switching integration
- ✅ Settings screen integration
- ✅ Organism component system
- ✅ Redux state management
- ✅ Animation and gesture handling
- ✅ Cross-platform compatibility

---

Add to `android/app/src/main/java/.../MainActivity.java`:

```java
package com.yourapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "YourApp";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}
```

**End of Document**

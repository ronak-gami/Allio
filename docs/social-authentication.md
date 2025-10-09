# Allio Social Media Authentication - Reference Guide


## 📋 Quick Reference

This guide shows how to implement social media authentication in your existing Allio project structure.

## 🏗 Current Project Integration

Based on your Allio project, integrate authentication into existing structure:

```
your-existing-src/
├── screens/          # Add LoginScreen here
├── components/       # Add SocialButtons here  
├── services/         # Add AuthService here
├── navigation/       # Modify existing navigator
└── utils/           # Add auth helpers
```

## 🔧 Quick Setup

### 1. Install Dependencies
```bash
npm install @react-native-google-signin/google-signin react-native-fbsdk-next
cd ios && pod install && cd ..
```

### 2. Configuration Setup
```javascript
// src/config/auth.js
export const AUTH_CONFIG = {
  google: {
    webClientId: 'YOUR_WEB_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
  },
  facebook: {
    appId: 'YOUR_FB_APP_ID',
    permissions: ['email', 'public_profile'],
  }
};
```

## 🔑 Service Integration

### Main Auth Service
```javascript
// src/services/AuthService.js
import GoogleSignin from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

class AuthService {
  // Initialize in your app startup
  init() {
    GoogleSignin.configure(AUTH_CONFIG.google);
  }

  // Google Sign-In
  async googleLogin() {
    const userInfo = await GoogleSignin.signIn();
    return userInfo.user;
  }

  // Facebook Login  
  async facebookLogin() {
    await LoginManager.logInWithPermissions(AUTH_CONFIG.facebook.permissions);
    const token = await AccessToken.getCurrentAccessToken();
    // Get user profile from Graph API
    return userProfile;
  }

  // Logout
  async logout() {
    await GoogleSignin.signOut();
    await LoginManager.logOut();
    // Clear your app's user data
  }
}

export default new AuthService();
```

## 📱 Screen Integration

### Add to Existing Navigation
```javascript
// In your existing navigation setup
import LoginScreen from '../screens/LoginScreen';

// Add to your stack navigator
<Stack.Screen name="Login" component={LoginScreen} />
```

### Login Screen Component
```javascript
// src/screens/LoginScreen.js
import AuthService from '../services/AuthService';

const LoginScreen = ({ navigation }) => {
  const handleGoogleLogin = async () => {
    try {
      const user = await AuthService.googleLogin();
      // Navigate to your main app screen
      navigation.navigate('YourMainScreen');
    } catch (error) {
      // Handle error
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleGoogleLogin}>
        <Text>Continue with Google</Text>
      </TouchableOpacity>
      {/* Similar for Facebook */}
    </View>
  );
};
```

## 🔗 Deep Linking Integration

### In your existing deep link handler
```javascript
// Add to your existing linking configuration
const linking = {
  prefixes: ['allio://'],
  config: {
    screens: {
      // Your existing screens
      Login: 'auth/login',
      AuthSuccess: 'auth/success',
    },
  },
};
```

## ⚙️ Platform Setup

### Android Configuration
Add to your existing `android/app/build.gradle`:
```gradle
dependencies {
    // Your existing dependencies
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
    implementation 'com.facebook.android:facebook-android-sdk:16.2.0'
}
```

### iOS Configuration  
Add to your existing `ios/Allio/Info.plist`:
```xml
<key>CFBundleURLSchemes</key>
<array>
    <string>YOUR_REVERSED_CLIENT_ID</string>
    <string>fbYOUR_FACEBOOK_APP_ID</string>
</array>
```

## 🚀 Integration Steps

### Step 1: Initialize Authentication
```javascript
// In your App.js or main component
import AuthService from './src/services/AuthService';

export default function App() {
  useEffect(() => {
    AuthService.init();
  }, []);
  
  // Your existing app code
}
```

### Step 2: Add Authentication Check
```javascript
// In your main navigator
const [user, setUser] = useState(null);

useEffect(() => {
  // Check if user is logged in
  const checkAuth = async () => {
    const currentUser = await AuthService.getCurrentUser();
    setUser(currentUser);
  };
  checkAuth();
}, []);

return (
  <NavigationContainer>
    {user ? <YourMainNavigator /> : <AuthNavigator />}
  </NavigationContainer>
);
```

### Step 3: Handle User State
```javascript
// In your user context or state management
const AuthContext = createContext();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  
  const login = async (provider) => {
    const userData = await AuthService[`${provider}Login`]();
    setUser(userData);
  };
  
  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };
  
  return { user, login, logout };
};
```

## 🔍 Testing in Your Project

### Test Authentication Flow
```bash
# Run your existing project
npx react-native run-android
npx react-native run-ios

# Test deep links
adb shell am start -W -a android.intent.action.VIEW -d "allio://auth/login" com.yourpackage.allio
```

## 🛠 Integration with Existing Features

### With Your User Profile
```javascript
// Update your existing user profile screen
const ProfileScreen = () => {
  const { user, logout } = useAuth();
  
  return (
    <View>
      <Text>{user.name}</Text>
      <Image source={{ uri: user.photo }} />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};
```

### With Your Navigation
```javascript
// Protect your existing screens
const ProtectedScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  if (!user) {
    navigation.navigate('Login');
    return null;
  }
  
  // Your existing screen content
};
```

## 📊 Quick Analytics
```javascript
// Add to your existing analytics
const trackAuth = (event, provider) => {
  // Your existing analytics service
  Analytics.track('auth_' + event, { provider });
};
```

## 🔐 Security Notes

1. **Store credentials securely** using your existing secure storage
2. **Validate tokens** before API calls
3. **Handle token refresh** automatically
4. **Clear data on logout** completely

## 📚 Project-Specific References

- **Your Repository**: ronak-gami/Allio
- **Your Branch**: features/rg/deep-linking  
- **Integration Point**: Existing navigation structure
- **User Management**: Your current user state system

---

**Quick Implementation**: Add auth services → Update navigation → Test flow  
**Developer**: ayushnathvani  
**Status**: Ready for integration into existing Allio project
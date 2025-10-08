# Social Authentication Documentation

## Overview
This document outlines the steps to implement social authentication using Google and Facebook for both Android and iOS platforms.

## Google Login Implementation Steps

1. **Create a Google Developer Project**
   - Go to the [Google Developers Console](https://console.developers.google.com/).
   - Create a new project and enable the "Google Sign-In" API.

2. **Configure OAuth Consent Screen**
   - Set up the OAuth consent screen with the required information.

3. **Generate OAuth 2.0 Credentials**
   - Create credentials for OAuth 2.0 Client IDs for both Android and iOS.

4. **Add Google Sign-In to Your App**
   - Follow the [official documentation](https://developers.google.com/identity/sign-in/android/start-integrating) for Android.
   - Follow the [official documentation](https://developers.google.com/identity/sign-in/ios/start-integrating) for iOS.

### Code Example for Google Login

```java
// Android Code Example
GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
        .requestEmail()
        .build();

GoogleSignInClient mGoogleSignInClient = GoogleSignIn.getClient(this, gso);
```

```swift
// iOS Code Example
GIDSignIn.sharedInstance.signIn(with: signInConfig, presenting: self) { user, error in
    // Handle sign-in
}
```

## Facebook Login Implementation Steps

1. **Create a Facebook App**
   - Go to the [Facebook Developers](https://developers.facebook.com/) page and create a new app.

2. **Configure App Settings**
   - Set up the app settings and enable Facebook Login.

3. **Add Facebook SDK to Your App**
   - Follow the [official documentation](https://developers.facebook.com/docs/facebook-login/android) for Android.
   - Follow the [official documentation](https://developers.facebook.com/docs/facebook-login/ios) for iOS.

### Code Example for Facebook Login

```java
// Android Code Example
LoginManager.getInstance().logInWithReadPermissions(this, Arrays.asList("email", "public_profile"));
```

```swift
// iOS Code Example
let loginManager = LoginManager()
loginManager.logIn(permissions: ["public_profile", "email"], from: self) { result, error in
    // Handle login
}
```

## Troubleshooting

- **Common Issues**
  - Make sure you have the correct package name and SHA-1 fingerprint for Android.
  - Ensure that your iOS bundle ID matches the one configured in the Facebook Developer Console.
  - Verify that you have set the correct OAuth redirect URIs.

- **Debugging Tips**
  - Use logging to track the authentication flow.
  - Check for errors returned by the SDKs and handle them appropriately.
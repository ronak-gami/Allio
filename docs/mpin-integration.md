# MPIN Integration Documentation

## 1. Setup Screens
### 1.1 Installation
To implement MPIN in your React Native application, first, install the necessary libraries:
```bash
npm install mpin-react-native
```

### 1.2 Initialization
Initialize the MPIN service in your application:
```javascript
import { MPIN } from 'mpin-react-native';

const mpin = new MPIN();
mpin.initialize();
```

## 2. Verification Screens
### 2.1 User Verification
To verify a user with MPIN, use the following code:
```javascript
const isVerified = await mpin.verifyUser(userId, pin);
if (isVerified) {
    console.log('User verified successfully');
} else {
    console.log('User verification failed');
}
```

## 3. Storage Utilities
### 3.1 Secure Storage
Ensure that sensitive information is stored securely. You can use libraries like `react-native-keychain` for secure storage:
```bash
npm install react-native-keychain
```

### 3.2 Storing MPIN
Example of storing MPIN securely:
```javascript
import * as Keychain from 'react-native-keychain';

async function storeMpin(mpin) {
    await Keychain.setGenericPassword('mpin', mpin);
}
```

## 4. Crypto Utilities
### 4.1 Encryption
For encryption, you can use the `crypto-js` library:
```bash
npm install crypto-js
```

### 4.2 Encrypting Data
Example of encrypting data:
```javascript
import CryptoJS from 'crypto-js';

const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
```

## 5. MPIN Service
### 5.1 Implementation
To implement the MPIN service:
```javascript
const mpinService = new MPINService();
mpinService.registerUser(userData);
```

### 5.2 Code Example
Here’s a complete example of implementing MPIN in a React Native component:
```javascript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { MPIN } from 'mpin-react-native';

const MyComponent = () => {
    const mpin = new MPIN();

    const handleMpinVerification = async () => {
        const isVerified = await mpin.verifyUser(userId, pin);
        if (isVerified) {
            console.log('User verified successfully');
        }
    };

    return (
        <View>
            <Text>MPIN Integration Example</Text>
            <Button title="Verify MPIN" onPress={handleMpinVerification} />
        </View>
    );
};

export default MyComponent;
```
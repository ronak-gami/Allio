# OTP Verification and MPIN Reset Flow

## 1. Node.js Backend Setup for OTP Verification

### Prerequisites
- Node.js installed
- Express framework
- Twilio and Firebase Admin SDK packages

### Installation
```bash
npm install express twilio firebase-admin
```

### Basic Server Setup
```javascript
const express = require('express');
const app = express();
app.use(express.json());
```

## 2. Twilio SMS Integration

### Twilio Setup
- Create a Twilio account
- Get Account SID and Auth Token

### Sending OTP
```javascript
const twilio = require('twilio');
const client = twilio('ACCOUNT_SID', 'AUTH_TOKEN');

function sendOTP(phoneNumber, otp) {
    client.messages.create({
        body: `Your OTP is ${otp}`,
        from: 'TWILIO_PHONE_NUMBER',
        to: phoneNumber
    });
}
```

## 3. Firebase Admin SDK Setup

### Firebase Setup
- Create a Firebase project
- Get the service account key

### Initialization
```javascript
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(require('./path/to/serviceAccountKey.json'))
});
```

## 4. OTP Generation and Verification Logic

### Generate OTP
```javascript
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
}
```

### Verify OTP
```javascript
let storedOTP; // Store OTP for verification

app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    if (otp === storedOTP) {
        res.send('OTP verified successfully!');
    } else {
        res.status(400).send('Invalid OTP');
    }
});
```

## 5. MPIN Reset Flow with API Endpoints

### API Endpoints
- `/request-otp`: Request OTP
- `/verify-otp`: Verify OTP and reset MPIN

### Sample Implementation
```javascript
app.post('/request-otp', (req, res) => {
    const { phoneNumber } = req.body;
    const otp = generateOTP();
    storedOTP = otp;
    sendOTP(phoneNumber, otp);
    res.send('OTP sent!');
});
```

## 6. React Native Integration Examples

### Sending OTP from React Native
```javascript
const requestOTP = async (phoneNumber) => {
    await fetch('http://yourserver.com/request-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
    });
};
```

### Verifying OTP
```javascript
const verifyOTP = async (otp) => {
    await fetch('http://yourserver.com/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
    });
};
```

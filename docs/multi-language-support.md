# Multi-Language Support Guide

## Introduction
This guide provides a comprehensive approach for implementing multi-language support in your React application using `i18next` version `24.2.2` and `react-i18next` version `15.1.1`. We will cover the setup for English, Hindi, and Gujarati languages.

## 1. Installation
To get started, install the necessary packages:

```bash
npm install i18next react-i18next
```

## 2. Translation Files
Create translation JSON files for each language in the `public/locales` directory:

### English (`public/locales/en/translation.json`):
```json
{
    "welcome": "Welcome",
    "description": "This is a multi-language support example."
}
```

### Hindi (`public/locales/hi/translation.json`):
```json
{
    "welcome": "स्वागत है",
    "description": "यह एक बहु-भाषा समर्थन उदाहरण है।"
}
```

### Gujarati (`public/locales/gu/translation.json`):
```json
{
    "welcome": "સ્વાગત છે",
    "description": "આ એક બહુ-ભાષી સપોર્ટ ઉદાહરણ છે."
}
```

## 3. i18n Configuration
Create a file `i18n.js` in your source directory to configure i18next:

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: require('./locales/en/translation.json') },
      hi: { translation: require('./locales/hi/translation.json') },
      gu: { translation: require('./locales/gu/translation.json') }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n;
```

## 4. Language Service
You can create a language service to manage the current language:

```javascript
import i18n from './i18n';

export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
};
```

## 5. Language Selector Component
Create a simple language selector component:

```javascript
import React from 'react';
import { changeLanguage } from './languageService';

const LanguageSelector = () => {
  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('hi')}>हिन्दी</button>
      <button onClick={() => changeLanguage('gu')}>ગુજરાતી</button>
    </div>
  );
};

export default LanguageSelector;
```

## 6. Usage Example
In your main application file, wrap your components with `I18nextProvider`:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App';

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>,
  document.getElementById('root')
);
```

In your components, use translations:

```javascript
import React from 'react';
import { useTranslation } from 'react-i18next';

const WelcomeComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
};

export default WelcomeComponent;
```

## Conclusion
You now have a multi-language support system set up with `i18next` and `react-i18next` for English, Hindi, and Gujarati. Customize your translation files and expand upon this foundational setup as needed.

# Implementing Theme Switching Using Tamagui UI

## Overview

This documentation outlines how to implement theme switching in your application using Tamagui UI version 1.132.23. The implementation includes support for both light and dark themes, a theme context provider, a theme toggle component, and integration with the StatusBar.

## 1. Light and Dark Theme Configuration

To set up light and dark themes in your Tamagui project, you need to define your theme configurations. Here is an example of how to configure themes:

```javascript
import { createTheme } from 'tamagui';

export const lightTheme = createTheme({
  colors: {
    background: '#ffffff',
    text: '#000000',
  },
});

export const darkTheme = createTheme({
  colors: {
    background: '#000000',
    text: '#ffffff',
  },
});
```

## 2. Theme Context Provider

Create a context provider to manage the current theme state and provide it throughout your application.

```javascript
import React, { createContext, useContext, useState } from 'react';
import { lightTheme, darkTheme } from './themes'; // Import themes

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
```

## 3. Theme Toggle Component

Implement a component that allows users to toggle between light and dark themes.

```javascript
import React from 'react';
import { Button } from 'tamagui';
import { useTheme } from './ThemeProvider';

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  return (
    <Button onPress={toggleTheme}>
      Toggle Theme
    </Button>
  );
};

export default ThemeToggle;
```

## 4. StatusBar Integration

To ensure the StatusBar matches the current theme, you can use the `StatusBar` component from React Native.

```javascript
import { StatusBar } from 'react-native';
import { useTheme } from './ThemeProvider';

const ThemedStatusBar = () => {
  const { theme } = useTheme();

  return (
    <StatusBar
      barStyle={theme === lightTheme ? 'dark-content' : 'light-content'}
      backgroundColor={theme.colors.background}
    />
  );
};
```

## 5. Code Examples

Here’s how to use the `ThemeProvider`, `ThemeToggle`, and `ThemedStatusBar` in your main application component:

```javascript
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import ThemeToggle from './ThemeToggle';
import ThemedStatusBar from './ThemedStatusBar';

const App = () => {
  return (
    <ThemeProvider>
      <ThemedStatusBar />
      <ThemeToggle />
      {/* Other components */}
    </ThemeProvider>
  );
};

export default App;
```

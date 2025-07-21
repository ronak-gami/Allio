import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import SplashScreen from './src/screens/splash';
import Onboarding from './src/screens/onboarding';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => setShowSplash(false), 2000); // Hide splash after 2s
  }, []);
  return (
    <View style={styles.container}>
      {showSplash ? <SplashScreen /> : <Onboarding />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

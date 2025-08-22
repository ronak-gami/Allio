// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Alert,
//   Platform,
//   ActivityIndicator,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import { Button } from '@components/index';
// import MapView, { Marker } from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
// import useStyle from './style';

// const LocationPickerScreen = ({ navigation, route }) => {
//   const { onSendLocation } = route.params;
//   const [currentLocation, setCurrentLocation] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const styles = useStyle();
//   useEffect(() => {
//     requestLocationPermission();
//   }, []);

//   const requestLocationPermission = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const permission =
//         Platform.OS === 'ios'
//           ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
//           : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

//       // Check current permission status
//       const currentStatus = await check(permission);

//       let finalStatus = currentStatus;

//       // Request permission if not granted
//       if (currentStatus !== RESULTS.GRANTED) {
//         finalStatus = await request(permission);
//       }

//       if (finalStatus === RESULTS.GRANTED) {
//         getCurrentLocation();
//       } else {
//         setError('Location permission is required to share your location.');
//         setLoading(false);
//       }
//     } catch (err) {
//       console.error('Permission request error:', err);
//       setError('Failed to request location permission.');
//       setLoading(false);
//     }
//   };

//   const getCurrentLocation = () => {
//     // Configure Geolocation for better reliability
//     Geolocation.setRNConfiguration({
//       skipPermissionRequests: false,
//       authorizationLevel: 'whenInUse',
//       enableBackgroundLocationUpdates: false,
//       locationProvider: 'auto',
//     });

//     const options = {
//       enableHighAccuracy: false,
//       timeout: 20000,
//       maximumAge: 30000,
//     };

//     Geolocation.getCurrentPosition(
//       position => {
//         const { latitude, longitude } = position.coords;
//         console.log('Location received:', { latitude, longitude });
//         setCurrentLocation({ latitude, longitude });
//         setLoading(false);
//         setError(null);
//       },
//       error => {
//         console.error('Geolocation error:', error);
//         setLoading(false);

//         switch (error.code) {
//           case 1: // PERMISSION_DENIED
//             setError(
//               'Location permission was denied. Please enable location services.',
//             );
//             break;
//           case 2: // POSITION_UNAVAILABLE
//             setError('Location information is unavailable. Please try again.');
//             break;
//           case 3: // TIMEOUT
//             setError(
//               'Location request timed out. Trying with lower accuracy...',
//             );
//             // Retry with lower accuracy settings
//             setTimeout(() => retryWithLowerAccuracy(), 1000);
//             break;
//           default:
//             setError('An unknown error occurred while getting location.');
//         }
//       },
//       options,
//     );
//   };

//   const retryWithLowerAccuracy = () => {
//     setLoading(true);

//     const lowAccuracyOptions = {
//       enableHighAccuracy: false,
//       timeout: 30000,
//       maximumAge: 30000, // Allow cached location up to 1 minute old
//     };

//     Geolocation.getCurrentPosition(
//       position => {
//         const { latitude, longitude } = position.coords;
//         console.log('Location received (retry):', { latitude, longitude });
//         setCurrentLocation({ latitude, longitude });
//         setLoading(false);
//         setError(null);
//       },
//       error => {
//         console.error('Retry geolocation error:', error);
//         setLoading(false);
//         setError(
//           'Unable to get your location. Please check your GPS settings and try again.',
//         );
//       },
//       lowAccuracyOptions,
//     );
//   };

//   const handleSendLocation = () => {
//     if (currentLocation) {
//       onSendLocation(currentLocation);
//       navigation.goBack();
//     }
//   };

//   const handleRetry = () => {
//     requestLocationPermission();
//   };

//   const handleManualLocation = () => {
//     // You can add manual location selection here if needed
//     Alert.alert(
//       'Manual Location',
//       'Manual location selection not implemented yet. Please enable GPS and try again.',
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={styles.loadingText}>Getting your location...</Text>
//       </View>
//     );
//   }

//   if (error && !currentLocation) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.manualButton}
//           onPress={handleManualLocation}>
//           <Text style={styles.manualButtonText}>Enter Location Manually</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!currentLocation) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Unable to get location</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: currentLocation.latitude,
//           longitude: currentLocation.longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//         showsUserLocation={true}
//         showsMyLocationButton={true}
//         followsUserLocation={false}>
//         <Marker
//           coordinate={currentLocation}
//           title="Your Location"
//           pinColor="red"
//         />
//       </MapView>
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Send This Location"
//           onPress={handleSendLocation}
//           style={styles.sendButton}
//         />
//         <Button
//           title="Refresh Location"
//           onPress={handleRetry}
//           style={styles.refreshButton}
//         />
//       </View>
//     </View>
//   );
// };

// export default LocationPickerScreen;
// // // // LocationPicker.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Linking,
  AppState,
} from 'react-native';
import { Button } from '@components/index';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import useStyle from './style';

const LocationPickerScreen = ({ navigation, route }) => {
  const { onSendLocation } = route.params;
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const styles = useStyle();

  useEffect(() => {
    requestLocationPermission();

    // Listen for app state changes to detect when user returns from settings
    const handleAppStateChange = nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground, check location again
        setTimeout(() => {
          requestLocationPermission();
        }, 1000);
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, [appState]);

  const requestLocationPermission = async () => {
    try {
      setLoading(true);
      setError(null);

      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      // Check current permission status
      const currentStatus = await check(permission);

      let finalStatus = currentStatus;

      // Request permission if not granted
      if (currentStatus !== RESULTS.GRANTED) {
        finalStatus = await request(permission);
      }

      if (finalStatus === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        setError('Location permission is required to share your location.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Permission request error:', err);
      setError('Failed to request location permission.');
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    // Configure Geolocation for better reliability
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
      enableBackgroundLocationUpdates: false,
      locationProvider: 'auto',
    });

    const options = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 30000,
    };

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Location received:', { latitude, longitude });
        setCurrentLocation({ latitude, longitude });
        setLoading(false);
        setError(null);
      },
      error => {
        console.error('Geolocation error:', error);
        setLoading(false);

        switch (error.code) {
          case 1: // PERMISSION_DENIED
            setError(
              'Location permission was denied. Please enable location services.',
            );
            break;
          case 2: // POSITION_UNAVAILABLE
            setError('Location information is unavailable. Please try again.');
            break;
          case 3: // TIMEOUT
            setError(
              'Location request timed out. Trying with lower accuracy...',
            );
            // Retry with lower accuracy settings
            setTimeout(() => retryWithLowerAccuracy(), 1000);
            break;
          default:
            setError('An unknown error occurred while getting location.');
        }
      },
      options,
    );
  };

  const retryWithLowerAccuracy = () => {
    setLoading(true);

    const lowAccuracyOptions = {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 30000, // Allow cached location up to 1 minute old
    };

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        console.log('Location received (retry):', { latitude, longitude });
        setCurrentLocation({ latitude, longitude });
        setLoading(false);
        setError(null);
      },
      error => {
        console.error('Retry geolocation error:', error);
        setLoading(false);
        setError(
          'Unable to get your location. Please check your GPS settings and try again.',
        );
      },
      lowAccuracyOptions,
    );
  };

  const handleSendLocation = () => {
    if (currentLocation) {
      onSendLocation(currentLocation);
      navigation.goBack();
    }
  };

  const openLocationSettings = () => {
    if (Platform.OS === 'android') {
      // Try different Android location settings intents
      const locationIntents = [
        'android.settings.LOCATION_SOURCE_SETTINGS',
        'android.settings.SECURITY_SETTINGS',
        'android.settings.SETTINGS',
      ];

      const tryOpenIntent = (intentIndex = 0) => {
        if (intentIndex >= locationIntents.length) {
          // Fallback to general settings
          Linking.openSettings().catch(() => {
            Alert.alert(
              'Error',
              'Please manually enable location services in your device settings.',
            );
          });
          return;
        }

        Linking.sendIntent(locationIntents[intentIndex]).catch(() => {
          // Try next intent
          tryOpenIntent(intentIndex + 1);
        });
      };

      tryOpenIntent();
    } else {
      // For iOS
      Linking.openURL('app-settings:').catch(err => {
        console.error('Cannot open settings:', err);
        Alert.alert(
          'Error',
          'Unable to open settings. Please manually enable location services.',
        );
      });
    }
  };

  const handleRetry = () => {
    requestLocationPermission();
  };

  const handleManualLocation = () => {
    // You can add manual location selection here if needed
    Alert.alert(
      'Manual Location',
      'Manual location selection not implemented yet. Please enable GPS and try again.',
    );
  };

  // Function removed - no longer needed

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (error && !currentLocation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.helpText}>
          Make sure GPS/Location services are enabled in your device settings.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={openLocationSettings}>
          <Text style={styles.settingsButtonText}>
            Enabled location services
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to get location</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={openLocationSettings}>
          <Text style={styles.settingsButtonText}>Open Location Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={false}>
        <Marker
          coordinate={currentLocation}
          title="Your Location"
          pinColor="red"
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button
          title="Send This Location"
          onPress={handleSendLocation}
          style={styles.sendButton}
        />
        <Button
          title="Refresh Location"
          onPress={handleRetry}
          style={styles.refreshButton}
        />
      </View>
    </View>
  );
};

export default LocationPickerScreen;

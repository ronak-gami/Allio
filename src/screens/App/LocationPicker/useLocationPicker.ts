import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import { showError } from '@utils/toast';
import { useNavigation } from '@react-navigation/native';

interface Location {
  latitude: number;
  longitude: number;
}

const useLocationPicker = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        console.log('🔄 Starting location initialization');

        // Request permission first
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to share it with friends',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );

        console.log('📍 Permission result:', granted);

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('❌ Permission denied');
          showError('Location permission is required');
          navigation.goBack();
          return;
        }

        console.log('✅ Permission granted, getting location...');

        // Success callback exactly as per documentation
        const success = (position: {
          coords: {
            latitude: number;
            longitude: number;
            altitude: number | null;
            accuracy: number;
            altitudeAccuracy: number | null;
            heading: number | null;
            speed: number | null;
          };
          timestamp: number;
        }) => {
          console.log('🎉 Location received:', position.coords);
          const { latitude, longitude } = position.coords;
          const locationData = { latitude, longitude };

          setCurrentLocation(locationData);
          // Auto-select current location
          setSelectedLocation(locationData);
          setIsLoading(false);
        };

        // Error callback exactly as per documentation
        const error = (error: {
          code: number;
          message: string;
          PERMISSION_DENIED: number;
          POSITION_UNAVAILABLE: number;
          TIMEOUT: number;
        }) => {
          console.log('❌ Geolocation error:', error.code, error.message);
          showError(`Location error: ${error.message}`);
          setIsLoading(false);
          navigation.goBack();
        };

        Geolocation.getCurrentPosition(success, error);
      } catch (error) {
        console.error('❌ Location initialization error:', error);
        showError('Failed to initialize location');
        setIsLoading(false);
        navigation.goBack();
      }
    };

    initializeLocation();
  }, [navigation]);

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  return {
    currentLocation,
    selectedLocation,
    handleMapPress,
    isLoading,
  };
};

export default useLocationPicker;

import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { showError } from '@utils/toast';
import { useNavigation } from '@react-navigation/native';
import { checkLocationPermission } from '@utils/helper';

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
        const hasPermission = await checkLocationPermission();

        if (!hasPermission) {
          showError('Location permission is required');
          navigation.goBack();
          return;
        }
        // Wrap Geolocation in a Promise for better async handling
        const getCurrentPosition = (): Promise<Location> => {
          return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
              position => {
                const { latitude, longitude } = position.coords;
                resolve({ latitude, longitude });
              },
              error => {
                if (error.code === 2) {
                  reject(new Error('Please enable GPS/Location Services'));
                } else {
                  reject(new Error(error.message));
                }
              },
            );
          });
        };

        const location = await getCurrentPosition();

        setCurrentLocation(location);
        setSelectedLocation(location);
        setIsLoading(false);
      } catch (error: any) {
        console.error('❌ Location initialization error:', error);
        showError(error.message || 'Failed to initialize location');
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

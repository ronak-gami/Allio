import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { HomeStackParamList } from '@types/navigations';
import { Container, Button } from '@components/index';
import useStyle from './style';
import useLocationPicker from './useLocationPicker';
import {
  getLocationCallback,
  removeLocationCallback,
} from '@utils/LocationCallbackManager';

type LocationPickerProps = NativeStackScreenProps<
  HomeStackParamList,
  'LocationPicker'
>;

const LocationPicker: React.FC<LocationPickerProps> = ({
  route,
  navigation,
}) => {
  const { callbackId } = route.params;
  const styles = useStyle();
  const { currentLocation, selectedLocation, handleMapPress, isLoading } =
    useLocationPicker();

  const handleShare = async () => {
    if (!selectedLocation) {
      return;
    }

    const callback = getLocationCallback(callbackId);
    if (callback) {
      await callback(selectedLocation);
      removeLocationCallback(callbackId);
      navigation.goBack();
    }
  };

  return (
    <Container
      showHeader
      title="Share Location"
      showBackArrow
      showLoader={isLoading}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: currentLocation?.latitude,
            longitude: currentLocation?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}>
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
            />
          )}
        </MapView>

        <View style={styles.buttonContainer}>
          <Button
            title="Share Location"
            onPress={handleShare}
            disabled={!selectedLocation}
          />
        </View>
      </View>
    </Container>
  );
};

export default LocationPicker;

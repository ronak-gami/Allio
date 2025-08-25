import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { IMAGES, ICONS } from '@assets/index';
import { HomeStackParamList } from '@types/navigations';
import useStyle from './style';
import { Button, Container, CustomHeader, Input } from '@components/index';
import { useUpdateProfile } from './useUpdateProfile';

type UpdateProfileRouteProp = RouteProp<HomeStackParamList, 'UpdateProfile'>;

const UpdateProfile: React.FC = () => {
  const route = useRoute<UpdateProfileRouteProp>();
  const styles = useStyle();

  const { email } = route.params;
  const {
    userData,
    setUserData,
    loading,
    saving,
    handlePickImage,
    handleSave,
  } = useUpdateProfile(email);

  return (
    <Container title="Video Media" showBackArrow>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={
                userData.profileImage
                  ? { uri: userData.profileImage }
                  : IMAGES.Dummy_Profile
              }
              style={styles.avatar}
            />

            <TouchableOpacity
              style={styles.editBadge}
              onPress={handlePickImage}
              disabled={loading}>
              <Image source={ICONS.Edit} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.gap}>
          <Input
            value={userData.firstName}
            onChangeText={text => setUserData({ ...userData, firstName: text })}
          />

          <Input
            value={userData.lastName}
            onChangeText={text => setUserData({ ...userData, lastName: text })}
          />

          <Input
            value={userData.mobileNo}
            onChangeText={text => setUserData({ ...userData, mobileNo: text })}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Button
            title={saving ? 'Updating...' : 'Save'}
            onPress={handleSave}
            disabled={saving}
          />
        </View>
      </View>
    </Container>
  );
};

export default UpdateProfile;

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CustomFlatList,
  LanguageOrganism,
  Text,
  ThemeOrganism,
  DeleteProfileOrganism,
  LogoutOrganism,
  Container,
  CustomToggleSwitch,
} from '@components/index';

import { TabParamList } from '@types/navigations';
import { useMore } from './useMore';
import useStyle from './style';

type Props = BottomTabScreenProps<TabParamList, 'More'>;

const More: React.FC<Props> = () => {
  const styles = useStyle();
  const {
    settingsConfig,
    handleItemPress,
    handleLogout,
    handleDeleteProfile,
    getTranslation,
    handleNotificationToggle,
    notificationsEnabled,
  } = useMore();

  const bottomSheetConfigs = {
    theme: {
      title: getTranslation('bottomSheet.selectTheme'),
      content: <ThemeOrganism />,
      snapPoints: ['40%'],
      showCloseButton: true,
    },
    language: {
      title: getTranslation('bottomSheet.selectLanguage'),
      content: <LanguageOrganism />,
      snapPoints: ['40%'],
      showCloseButton: true,
    },
    delete: {
      title: getTranslation('bottomSheet.deleteAccount'),
      content: <DeleteProfileOrganism onConfirm={handleDeleteProfile} />,
      showCloseButton: true,
      snapPoints: ['50%'],
      buttons: [
        {
          title: getTranslation('bottomSheet.deleteAccount'),
          onPress: handleDeleteProfile,
          variant: 'primary',
        },
      ],
    },
    logout: {
      title: getTranslation('bottomSheet.confirmLogout'),
      content: <LogoutOrganism onConfirm={handleLogout} />,
      showCloseButton: true,
      snapPoints: ['50%'],
      buttons: [
        {
          title: getTranslation('bottomSheet.confirmLogout'),
          onPress: handleLogout,
          variant: 'primary',
        },
      ],
    },
  };

  const renderItem = ({ item }: { item: { key: string; title: string } }) => (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleItemPress(item.key, bottomSheetConfigs)}>
        <Text style={styles.itemText} type="semibold">
          {item.title}
        </Text>
        {item.key === 'notifications' && (
          <CustomToggleSwitch
            isOn={notificationsEnabled}
            onToggle={handleNotificationToggle}
          />
        )}
      </TouchableOpacity>
      <View style={styles.separator} />
    </>
  );

  return (
    <Container showLoader={false} title="More.More">
      <View style={styles.container}>
        <CustomFlatList data={settingsConfig} renderItem={renderItem} />
      </View>
    </Container>
  );
};

export default More;

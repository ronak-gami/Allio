import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CustomFlatList,
  LanguageOrganism,
  LogoutOrganism,
  Text,
  ThemeOrganism,
} from '@components/index';

import useStyle from './style';
import {
  CustomBottomSheetModal,
  BottomSheetWrapper,
} from '@components/molecules/CustomBottomSheetModal';
import DeleteProfileOrganism from '@components/organisms/Deleteorganism';
import useMore, { settingsData } from './useMore';
import { TabParamList } from '@types/navigations';

type Props = BottomTabScreenProps<TabParamList, 'More'>;

const More: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const more = useMore(navigation);

  const renderItem = ({ item }: { item: { key: string; title: string } }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => more.handleItemPress(item.key)}>
      <Text style={styles.itemText} type="semibold">
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderSheetContent = () => {
    switch (more.sheetType) {
      case 'theme':
        return (
          <ThemeOrganism
            selectedTheme={more.selectedTheme}
            onSelect={more.setSelectedTheme}
          />
        );
      case 'language':
        return (
          <LanguageOrganism
            selectedLanguage={more.selectedLanguage}
            onSelect={more.setSelectedLanguage}
          />
        );
      case 'logout':
        return <LogoutOrganism onConfirm={more.handleLogout} />;
      case 'delete':
        return <DeleteProfileOrganism onConfirm={more.handleDeleteProfile} />;
      default:
        return null;
    }
  };

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <Text style={styles.title} type="BOLD">
          More.More
        </Text>
        <CustomFlatList data={settingsData} renderItem={renderItem} />

        <CustomBottomSheetModal
          ref={more.sheetRef}
          title={more.getSheetTitle()}
          buttonTitle={more.getButtonTitle()}
          onButtonPress={more.handleButtonPress()}
          onClose={more.handleSheetClose}
          onTabBarVisibilityChange={more.handleTabBarVisibility}
          enableBackdrop={true}
          enableHandle={true}
          backdropOpacity={0.7}>
          {renderSheetContent()}
        </CustomBottomSheetModal>
      </View>
    </BottomSheetWrapper>
  );
};

export default More;

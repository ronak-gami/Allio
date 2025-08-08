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
  CustomBottomSheetModal,
} from '@components/index';
import useStyle from './style';
import { BottomSheetWrapper } from '@components/molecules/CustomBottomSheetModal';
import useMore from './useMore';
import { TabParamList } from '@types/navigations';
import { settingsData } from '@utils/constant';

type Props = BottomTabScreenProps<TabParamList, 'More'>;

const More: React.FC<Props> = ({ navigation }) => {
  const styles = useStyle();
  const more = useMore(navigation);
  const { states } = more;

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
    switch (states.sheetType) {
      case 'theme':
        return (
          <ThemeOrganism
            selectedTheme={states.selectedTheme}
            onSelect={states.setSelectedTheme}
          />
        );
      case 'language':
        return (
          <LanguageOrganism
            selectedLanguage={states.selectedLanguage}
            onSelect={states.setSelectedLanguage}
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
          ref={states.sheetRef}
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

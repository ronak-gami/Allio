import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@components/index';
import useStyle from './style';

const CustomSimpleTab = ({
  tabs = [],
  activeTab,
  onTabChange,
  containerStyle,
  tabStyle,
  activeTabStyle,
  tabTextStyle,
  activeTabTextStyle,
  tabIconStyle,
  activeTabIconStyle,
  activeIndicatorStyle,
  textType = 'SEMIBOLD',
  activeTextType = 'BOLD',
  iconSize,
  disabled = false,
}) => {
  const styles = useStyle({
    iconSize,
    disabled,
  });

  const handleTabPress = tab => {
    if (!disabled && onTabChange) {
      onTabChange(tab.id, tab);
    }
  };

  const renderTabContent = (tab, isActive) => {
    const hasIcon = !!tab.icon;
    const hasTitle = !!tab.title;

    if (hasIcon && hasTitle) {
      // Icon + Text variant (Icon above text)
      return (
        <>
          <Image
            source={tab.icon}
            style={[
              styles.tabIcon,
              tabIconStyle,
              isActive && { ...styles.activeTabIcon, ...activeTabIconStyle },
            ]}
            resizeMode="contain"
          />
          <Text
            type={isActive ? activeTextType : textType}
            style={[
              styles.tabText,
              tabTextStyle,
              isActive && { ...styles.activeTabText, ...activeTabTextStyle },
            ]}>
            {tab.title}
          </Text>
        </>
      );
    } else if (hasIcon) {
      // Icon-only variant
      return (
        <Image
          source={tab.icon}
          style={[
            styles.tabIcon,
            tabIconStyle,
            isActive && { ...styles.activeTabIcon, ...activeTabIconStyle },
          ]}
          resizeMode="contain"
        />
      );
    } else if (hasTitle) {
      // Text-only variant
      return (
        <Text
          type={isActive ? activeTextType : textType}
          style={[
            styles.tabText,
            tabTextStyle,
            isActive && { ...styles.activeTabText, ...activeTabTextStyle },
          ]}>
          {tab.title}
        </Text>
      );
    }

    return null;
  };

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              tabStyle,
              isActive && { ...styles.activeTab, ...activeTabStyle },
            ]}
            onPress={() => handleTabPress(tab)}
            disabled={disabled}>
            {renderTabContent(tab, isActive)}

            {/* Custom Active Indicator */}
            {isActive && activeIndicatorStyle && (
              <View style={[styles.activeIndicator, activeIndicatorStyle]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomSimpleTab;




import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import Text from '@components/atoms/Text';
import { ICONS } from '@assets/index';
import useStyle from './style';

const tabs = ['Albums', 'Gallery', 'Favourites', 'Add'];

const Header = ({ title, activeTab }: { title: string; activeTab: string }) => {
  const styles = useStyle();
  return (
    <View style={styles.container}>
      <Text type="bold" style={styles.title}>
        {title}
      </Text>

      <View style={styles.row}>
        {tabs.map(tab => (
          <TouchableOpacity key={tab} style={styles.tab}>
            <Image
              source={ICONS[tab.toLowerCase()] || ICONS.default}
              style={styles.icon}
            />
            <Text
              style={[styles.label, activeTab === tab && styles.activeLabel]} type='bold'>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Header;

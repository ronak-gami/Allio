import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Container } from '@components/index';
import useStyle from './styles';
import useNews from './useNews';

const News = () => {
  const [activeTab, setActiveTab] = useState<'News List' | 'Add List'>(
    'News List',
  );
  const styles = useStyle();
  const { newsList } = useNews();

  return (
    <Container showBackArrow title="News">
      <View style={styles.headerContainer}>
        {['News List', 'Add List'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab as any)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && <View style={styles.bottomLine} />}
          </TouchableOpacity>
        ))}
      </View>
    </Container>
  );
};

export default News;

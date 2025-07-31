import React, { useState } from 'react';
import { View, Image, ImageBackground, SafeAreaView } from 'react-native';
import Text from '@components/atoms/Text';
import Button from '@components/atoms/Button';
import useStyle from './style';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@types/navigations';
import { IMAGES } from '@assets/index';
import Header from '@components/organisms/PhotoMediaHeader';
import Footer from '@components/organisms/PhotoMediaFooter';

type Props = BottomTabScreenProps<TabParamList, 'Photo'>;

const PhotoMedia: React.FC<Props> = () => {
  const styles = useStyle();
  const [showEditor, setShowEditor] = useState(false);

  const handleTryNow = () => {
    setShowEditor(true);
  };

  if (!showEditor) {
    return (
      <ImageBackground
        source={IMAGES.background}
        style={styles.bgImage}
        resizeMode="cover">
        <Image
          source={IMAGES.camera}
          style={styles.icon}
          resizeMode="contain"
        />
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <Text type="bold" style={styles.heading}>
              Edit Photos and Videos Like a Pro in Just One Click.
            </Text>
            <Button title="Try it Now" onPress={handleTryNow} />
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Studio" activeTab="Gallery" />

      <Footer />
    </SafeAreaView>
  );
};

export default PhotoMedia;

import React, { memo } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import CustomLoader from '@components/atoms/CustomLoader';
import useStyle from './style';
import HomeHeader from '@components/organisms/HomeHeader';

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  onProfilePress?: () => void;
  showLoader?: boolean;
  loaderText?: string;

  useScrollView?: boolean;
  keyboardAvoiding?: boolean;
  keyboardOffset?: number;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
}

const Container: React.FC<PageLayoutProps> = ({
  children,
  showHeader = true,
  onProfilePress,
  showLoader = false,
  loaderText = 'Loading...',
  useScrollView = false,
  keyboardAvoiding = false,
  style,
}) => {
  const { colors } = useTheme();
  const styles = useStyle();
  const Content = () =>
    useScrollView ? (
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[style]}>
        {children}
      </ScrollView>
    ) : (
      <View style={styles.flex}>{children}</View>
    );
  return (
    <View style={[styles.flex, style, { backgroundColor: colors.background }]}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}>
          {showHeader && (
            <HomeHeader onProfilePress={onProfilePress ?? (() => {})} />
          )}
          <Content />
          {showLoader && <CustomLoader visible text={loaderText} />}
        </KeyboardAvoidingView>
      ) : (
        <>
          {showHeader && (
            <HomeHeader onProfilePress={onProfilePress ?? (() => {})} />
          )}
          <Content />
          {showLoader && <CustomLoader visible text={loaderText} />}
        </>
      )}
    </View>
  );
};

export default memo(Container);

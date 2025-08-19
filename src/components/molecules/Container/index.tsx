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
import StatusBar from '@components/atoms/CustomStatusBar';
import CustomHeader from '@components/atoms/CustomHeader';

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  onProfilePress?: () => void;
  showLoader?: boolean;
  loaderText?: string;
  keyboardAvoiding?: boolean;
  style?: ViewStyle;
  auth?: boolean;
  showProfileLogo?: boolean;
  showAppLogo?: boolean;
  showBackArrow?: boolean;
  title?: string;
}

const Container: React.FC<PageLayoutProps> = ({
  children,
  showHeader = true,
  onProfilePress,
  showLoader = false,
  loaderText = 'Loading...',
  keyboardAvoiding = false,
  style,
  auth = false,
  showProfileLogo = false,
  showAppLogo = false,
  showBackArrow = false,
  title = '',
}) => {
  const { colors, dark } = useTheme();
  const styles = useStyle();

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={auth ? colors.background : colors.primary}
        barStyle={auth && dark ? 'light-content' : 'dark-content'}
      />
      {showHeader && (
        <CustomHeader
          showProfileLogo={showProfileLogo}
          showAppLogo={showAppLogo}
          onProfilePress={onProfilePress}
          showBackArrow={showBackArrow}
          title={title}
        />
      )}
      <CustomLoader visible={showLoader} text={loaderText} />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.flex, style]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContainer}>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <>{children}</>
      )}
    </View>
  );
};

export default memo(Container);

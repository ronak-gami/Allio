import { useNavigationContainerRef } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import React, { useRef, useEffect } from 'react';

export function useScreenTracking(navigationRef: any) {
  const routeNameRef = useRef<string | undefined>();

  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener?.('state', async () => {
      const currentRouteName = navigationRef.current?.getCurrentRoute?.()?.name;
      if (routeNameRef.current !== currentRouteName && currentRouteName) {
        await analytics().logScreenView({
          screen_name: currentRouteName,
          screen_class: currentRouteName,
        });
        routeNameRef.current = currentRouteName;
      }
    });
    return unsubscribe;
  }, [navigationRef]);
}

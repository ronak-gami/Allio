import { createNavigationContainerRef } from '@react-navigation/native';
import type { HomeStackParamList } from '@types/navigations';

// If you want to cover both Auth + Home stacks you can widen the type to any
export const navigationRef = createNavigationContainerRef<any>();

export const navigate = <Name extends keyof HomeStackParamList>(
  name: Name,
  params?: HomeStackParamList[Name],
) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
};

export const getCurrentRouteName = () => {
  return navigationRef.getCurrentRoute()?.name;
};

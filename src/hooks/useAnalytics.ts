import analytics from '@react-native-firebase/analytics';
import { useEffect } from 'react';

export type AnalyticsHandlerProps = {
  screenName?: string;
  functionName?: string;
  data?: Record<string, any>;
  login?: string;
  signUp?: string;
  search?: string;
};

const useAnalytics = ({
  screenName,
  functionName,
  data,
  login,
  signUp,
  search,
}: AnalyticsHandlerProps) => {
  const track = {
    event: async (name: string, payload?: Record<string, any>) => {
      await analytics().logEvent(name, payload ?? {});
    },
    login: async (method: string) => {
      await analytics().logLogin({ method });
    },
    signup: async (method: string) => {
      await analytics().logSignUp({ method });
    },
    search: async (term: string) => {
      await analytics().logSearch({ search_term: term });
    },
  };

  if (functionName) track.event(functionName, data);
  if (login) track.login(login);
  if (signUp) track.signup(signUp);
  if (search) track.search(search);

  return { track };
};
export default useAnalytics;

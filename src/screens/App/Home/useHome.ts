import { useEffect } from 'react';
import { applyNotificationSettings } from '@utils/helper';

const useHome = () => {
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      await applyNotificationSettings();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return {};
};

export default useHome;

import { useEffect } from 'react';
import { requestNotificationPermission } from '@utils/helper';

const useHome = () => {
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      await requestNotificationPermission();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return {};
};
export default useHome;

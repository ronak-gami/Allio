import { useEffect } from 'react';
import { requestUserPermission } from '@utils/helper';

const useHome = () => {
  useEffect(() => {
    // Call this after MPIN is verified
    requestUserPermission();
  }, []);

  return {};
};

export default useHome;

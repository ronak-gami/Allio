import { useCallback } from 'react';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { clearPendingDeepLink } from '@redux/slices/deepLinkSlice';
import { promptAppLock } from '@utils/auth';
import { HOME } from '@utils/constant';
import { checkIfMPINExists } from '@utils/helper';

type MPINScreenRouteParams = {
  MPIN: {
    email: string;
    resetMpin: boolean;
  };
};

const useMpin = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MPINScreenRouteParams, 'MPIN'>>();
  const { resetMpin, email } = route.params || {};
  const userData = useSelector((state: RootState) => state.auth.userData);
  const pendingDeepLink = useSelector(
    (state: RootState) => state.deepLink.pending,
  );
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const verifyMPIN = async () => {
        if (!userData?.email) {
          return;
        }
        const mpinExist = await checkIfMPINExists(userData.email);
        if (mpinExist && !resetMpin) {
          const success = await promptAppLock();
          if (success) {
            if (pendingDeepLink) {
              navigation.replace(
                pendingDeepLink.routeName as never,
                (pendingDeepLink.params || {}) as never,
              );
              dispatch(clearPendingDeepLink());
            } else {
              navigation.replace(HOME.HomeTabs as never);
            }
          }
        }
      };
      verifyMPIN();
    }, [userData?.email, navigation, resetMpin, pendingDeepLink, dispatch]),
  );
  return { resetMpin, email };
};

export default useMpin;

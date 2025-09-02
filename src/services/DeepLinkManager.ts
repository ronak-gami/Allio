import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  extractShareId,
  extractShareEmail,
  resolveSharedMedia,
  extractProfileEmail,
} from '@utils/deepLinking';
import { getUserData } from '@utils/helper';
import { RootState } from '@redux/store';
import {
  setPendingDeepLink,
  markDeepLinkResolved,
} from '@redux/slices/deepLinkSlice';

const DeepLinkManager: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((s: RootState) => s.auth.token);
  const alreadyResolved = useSelector((s: RootState) => s.deepLink.resolved);

  useEffect(() => {
    if (alreadyResolved) {
      return;
    }

    const handleUrl = async (url?: string | null) => {
      if (!url) {
        dispatch(markDeepLinkResolved());
        return;
      }

      try {
        // Profile deep link
        const profileEmail = extractProfileEmail(url);
        if (profileEmail) {
          dispatch(
            setPendingDeepLink({
              routeName: 'Profile',
              params: { email: profileEmail },
            }),
          );
          dispatch(markDeepLinkResolved());
          return;
        }

        // Shared media (ChatDetails)
        const id = extractShareId(url);
        if (!id) {
          dispatch(markDeepLinkResolved());
          return;
        }

        const rec = await resolveSharedMedia(id);
        if (!rec) {
          dispatch(markDeepLinkResolved());
          return;
        }

        const senderEmail = (
          rec.sender ||
          extractShareEmail(url) ||
          ''
        ).toLowerCase();

        let fullUser: any = null;
        if (senderEmail) {
          try {
            const profile = await getUserData(senderEmail);
            if (profile) {
              fullUser = {
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                mobileNo: profile.mobileNo,
                profileImage: profile.profileImage,
              };
            }
          } catch (e) {
            console.warn('Deep link profile fetch failed', e);
          }
        }

        const params = {
          sharedMediaId: rec.id,
          mediaUrl: rec.mediaUrl,
          type: rec.type,
          user: fullUser || (senderEmail ? { email: senderEmail } : undefined),
          email: senderEmail,
        };

        dispatch(
          setPendingDeepLink({
            routeName: 'ChatDetailsScreen',
            params,
          }),
        );
      } catch (e) {
        console.warn('DeepLink parse error', e);
      } finally {
        dispatch(markDeepLinkResolved());
      }
    };

    // Initial URL
    Linking.getInitialURL()
      .then(handleUrl)
      .catch(() => dispatch(markDeepLinkResolved()));

    // Runtime events
    const sub = Linking.addEventListener('url', e => {
      handleUrl(e.url);
    });

    return () => sub.remove();
  }, [alreadyResolved, dispatch, token]);

  return null;
};

export default DeepLinkManager;

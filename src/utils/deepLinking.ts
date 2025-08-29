import firestore from '@react-native-firebase/firestore';

// Basic id generator (avoid extra deps)
const genId = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const DOMAIN = 'https://allio-app-bxwta.ondigitalocean.app';
const DOMAIN_HOST = (() => {
  try {
    return new URL(DOMAIN).host;
  } catch {
    return 'allio-app-bxwta.ondigitalocean.app';
  }
})();

export interface SharedMediaRecord {
  id: string;
  type: 'image' | 'video';
  mediaUrl: string;
  sender: string;
  relationId?: string;
  messageId?: string;
  createdAt: FirebaseFirestore.FieldValue;
}

export const createSharedMediaLink = async (opts: {
  type: 'image' | 'video';
  mediaUrl: string;
  sender: string;
}) => {
  const id = genId();

  const doc = {
    id,
    mediaUrl: opts.mediaUrl,
    sender: opts.sender,
    type: opts.type,
  };

  try {
    await firestore().collection('shared_media').doc(id).set(doc);
  } catch (e) {
    console.warn('createSharedMediaLink Firestore error', e);
    throw e;
  }

  // Append sender email as query param "email"
  return {
    universal: `${DOMAIN}/m/${id}?email=${encodeURIComponent(
      opts.sender.toLowerCase(),
    )}`,
    scheme: `allio://m/${id}?email=${encodeURIComponent(
      opts.sender.toLowerCase(),
    )}`,
    id,
  };
};

// Parse incoming URL -> share id
export const extractShareId = (url?: string | null) => {
  if (!url) {
    return null;
  }
  try {
    const u = new URL(url);
    if (u.hostname === DOMAIN_HOST && u.pathname.startsWith('/m/')) {
      return u.pathname.substring(3); // after /m/
    }
    if (u.protocol === 'allio:' && u.pathname.startsWith('/m/')) {
      return u.pathname.substring(3);
    }
  } catch {
    const match = url.match(/\/m\/([A-Za-z0-9]+)/);
    return match?.[1] || null;
  }
  return null;
};

// Keep existing extractShareId; add helper to extract email too
export const extractShareEmail = (url?: string | null) => {
  if (!url) {
    return null;
  }
  try {
    const u = new URL(url);
    const email = u.searchParams.get('email');
    return email ? decodeURIComponent(email).toLowerCase() : null;
  } catch {
    const match = url.match(/[?&]email=([^&]+)/);
    return match ? decodeURIComponent(match[1]).toLowerCase() : null;
  }
};

export const resolveSharedMedia = async (id: string) => {
  if (!id) {
    return null;
  }
  const snap = await firestore().collection('shared_media').doc(id).get();
  if (!snap.exists) {
    return null;
  }
  return snap.data() as SharedMediaRecord;
};

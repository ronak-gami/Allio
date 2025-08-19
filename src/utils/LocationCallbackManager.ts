export type LocationCallback = (location: {
  latitude: number;
  longitude: number;
}) => Promise<void>;

// Create a Map to store callbacks
const callbacks = new Map<string, LocationCallback>();

// Register a new callback and return its ID
export const registerLocationCallback = (
  callback: LocationCallback,
): string => {
  console.log('🎯 Registering new location callback');
  const callbackId = Math.random().toString(36).substring(7);
  callbacks.set(callbackId, callback);
  console.log('✅ Callback registered with ID:', callbackId);
  return callbackId;
};

// Get a callback by its ID
export const getLocationCallback = (
  id: string,
): LocationCallback | undefined => {
  return callbacks.get(id);
};

// Remove a callback by its ID
export const removeLocationCallback = (id: string): void => {
  callbacks.delete(id);
};

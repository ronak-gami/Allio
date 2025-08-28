import client from '@api/Client';
import { isOnline } from './helper';
import { showError, showSuccess } from './toast';

export interface SyncAndFetchParams {
  endpoint: string;
  realmService: any;
  forceRefresh?: boolean;
  deletedFlagKey?: string;
  editedFlagKey?: string;
  dataKey?: string;
  mapToApi?: (item: any) => any;
}

export interface AddGenericParams<T> {
  endpoint: string;
  realmService: any;
  values: T;
  mapToApi?: (item: T) => any;
}

export interface DeleteGenericParams {
  endpoint: string;
  realmService: any;
  id: string;
  deletedFlagKey?: string;
}

let hasFetchedOnceMap: Record<string, boolean> = {};

const syncAndFetchGeneric = async ({
  endpoint,
  realmService,
  deletedFlagKey = 'deletedFlag',
  editedFlagKey = 'editedFlag',
  forceRefresh = false,
  dataKey = 'data',
  mapToApi = item => item,
}: SyncAndFetchParams) => {
  const online = await isOnline();
  const localData = await realmService.getNews();
  const offline = await realmService.getOfflineNews();

  // Track fetch per endpoint
  if (hasFetchedOnceMap[endpoint] === undefined)
    hasFetchedOnceMap[endpoint] = false;
  let needApiFetch = online && (!hasFetchedOnceMap[endpoint] || forceRefresh);

  try {
    // Sync unsynced data if online
    if (online) {
      for (const item of offline || []) {
        if (item?.[deletedFlagKey]) {
          // Deleted: call DELETE
          await client({
            method: 'delete',
            url: `${endpoint}/${item?.id}`,
          });
        } else if (item?.[editedFlagKey]) {
          // Edited: call PUT
          const { [editedFlagKey]: _, ...rest } = item;

          const isDateId = /^\d+$/.test(item?.id); // true if id is all digits (Date.now().toString())
          if (isDateId) {
            const { [editedFlagKey]: _, id, ...rest } = item;
            // New item, call POST
            await client({
              method: 'post',
              url: endpoint,
              data: mapToApi(rest),
            });
          } else {
            // Existing item, call PUT
            await client({
              method: 'put',
              url: `${endpoint}/${item?.id}`,
              data: mapToApi(rest),
            });
          }
        } else {
          // New: call POST
          await client({
            method: 'post',
            url: endpoint,
            data: mapToApi(item),
          });
        }
        needApiFetch = true;
      }
    }

    // Fetch from API only once per session, after sync, or if forced
    if (needApiFetch) {
      const response = await client({
        method: 'get',
        url: endpoint,
      });
      const apiData = response?.data?.[dataKey] || [];
      realmService.deleteAllNews();
      realmService.deleteAllOfflineNews();
      realmService.saveAllNews(apiData);
      hasFetchedOnceMap[endpoint] = true;
      showSuccess('Synced and fetched successfully');
      return { data: { [dataKey]: apiData } };
    }

    // Just return local data if no API fetch needed
    return { data: { [dataKey]: localData } };
  } catch (error) {
    showError(error?.response?.data?.error || 'Something went wrong');
    return { data: { [dataKey]: [] }, error };
  }
};

const addGenericResponse = async <T>({
  endpoint,
  realmService,
  values,
  mapToApi = (item: T) => item,
}: AddGenericParams<T>) => {
  const online = await isOnline();

  const newItem: any = {
    id: Date.now().toString(),
    ...values,
  };

  realmService.addNews(newItem);

  // If offline, also add to offline table
  if (!online) {
    realmService.addOfflineNews(newItem);
  }

  if (online) {
    const { id, ...rest } = newItem;
    try {
      const response = await client({
        method: 'post',
        url: endpoint,
        data: mapToApi(rest),
      });
      showSuccess(response?.data?.message);
    } catch (error) {
      throw error;
    }
  }

  return { data: { data: newItem } };
};

const deleteGenericResponse = async ({
  endpoint,
  realmService,
  id,
  deletedFlagKey = 'deletedFlag',
}: DeleteGenericParams) => {
  const online = await isOnline();

  if (online) {
    const response = await client({
      method: 'delete',
      url: `${endpoint}/${id}`,
    });
    showSuccess(response?.data?.message);
  } else {
    realmService.addOfflineNews({ id, [deletedFlagKey]: true });
    showSuccess('Deleted successfully');
  }
  realmService.removeNews(id);
};

const editGenericResponse = async <T>({
  endpoint,
  realmService,
  values,
  mapToApi = (item: T) => item,
}: AddGenericParams<T>) => {
  const online = await isOnline();

  const newItem: any = {
    id: values?.id || Date.now().toString(),
    ...values,
    editedFlag: !online, // Set flag only if offline
  };

  realmService.addNews(newItem);

  // If offline, also add to offline table with editedFlag
  if (!online) {
    realmService.addOfflineNews(newItem);
    showSuccess('Changes saved offline');
  }

  if (online) {
    const { editedFlag, id, ...rest } = newItem;
    try {
      const response = await client({
        method: 'put',
        url: `${endpoint}/${newItem?.id}`,
        data: mapToApi(rest),
      });
      showSuccess(response?.data?.message);
    } catch (error) {
      throw error;
    }
  }

  return { data: { data: newItem } };
};

export {
  syncAndFetchGeneric,
  addGenericResponse,
  deleteGenericResponse,
  editGenericResponse,
};

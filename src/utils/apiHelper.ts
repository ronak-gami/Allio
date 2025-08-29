import client from '@api/Client';
import { isOnline } from './helper';
import { showError, showSuccess } from './toast';

import { timeService } from '../realm/services';

export interface ManageGenericParams<T = any> {
  method: 'get' | 'post' | 'put' | 'delete';
  endpoint: string;
  realmService: any;
  values?: T;
  id?: string;
  forceRefresh?: boolean;
  deletedFlagKey?: string;
  editedFlagKey?: string;
  dataKey?: string;
  mapToApi?: (item: any) => any;
}

let hasFetchedOnceMap: Record<string, boolean> = {};

// Unified request function for all CRUD operations
const apiRequest = async (
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  headers?: any,
) => client({ method, url, data, headers });

const manageGenericReponse = async <T>({
  method,
  endpoint,
  realmService,
  values,
  id,
  forceRefresh = false,
  deletedFlagKey = 'deletedFlag',
  editedFlagKey = 'editedFlag',
  dataKey = 'data',
  mapToApi = item => item,
}: ManageGenericParams<T>) => {
  const online = await isOnline();

  if (method === 'get') {
    // Local online status and data
    const localData = await realmService.getOnlineData();

    // Local offline changes
    const offline = await realmService.getOfflineData();

    if (hasFetchedOnceMap[endpoint] === undefined)
      hasFetchedOnceMap[endpoint] = false;
    let needApiFetch = online && (!hasFetchedOnceMap[endpoint] || forceRefresh);

    try {
      if (online) {
        for (const item of offline || []) {
          if (item?.[deletedFlagKey]) {
            // checked for deleted item and call DELETE
            await apiRequest('delete', `${endpoint}/${item?.id}`);
          } else if (item?.[editedFlagKey]) {
            // checked for edited item
            const isDateId = /^\d+$/.test(item?.id);
            const { [editedFlagKey]: _, id, ...rest } = item;
            if (isDateId) {
              // checked for new but edited item and call POST
              await apiRequest('post', endpoint, mapToApi(rest));
            } else {
              // checked for edited item and call PUT
              await apiRequest(
                'put',
                `${endpoint}/${item?.id}`,
                mapToApi(rest),
              );
            }
          } else {
            // checked for new item and call POST
            await apiRequest('post', endpoint, mapToApi(item));
          }
          needApiFetch = true;
        }
      }

      if (needApiFetch) {
        //fetch from API only once per session, after sync, or if forced
        const response = await apiRequest('get', endpoint);
        const apiData = response?.data?.[dataKey] || [];

        // Clear and save fresh data
        realmService.deleteAllOnlineData();
        // Clear offline table too as all synced
        realmService.deleteAllOfflineData();
        // Save new data from API
        realmService.saveAllOnlineData(apiData);
        // Save timestamp of last successful fetch
        const time = {
          key: endpoint,
          timeStamp: new Date().toISOString(),
        };
        timeService.addTime(time);

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
  }

  if (method === 'post') {
    const newItem: any = {
      id: Date.now().toString(),
      ...values,
    };

    // Always add to local DB
    realmService.addOnlineData(newItem);

    // If offline, also add to offline table
    if (!online) {
      realmService.addOfflineData(newItem);
    }

    // If online, call API
    if (online) {
      const { id, ...rest } = newItem;
      try {
        const response = await apiRequest('post', endpoint, mapToApi(rest));
        showSuccess(response?.data?.message);
      } catch (error) {
        throw error;
      }
    }

    return { data: { data: newItem } };
  }

  if (method === 'put') {
    const newItem: any = {
      id: values?.id || Date.now().toString(),
      ...values,
      editedFlag: !online, // Set flag only if offline
    };

    // Always add/update in local DB
    realmService.addOnlineData(newItem);

    // If offline, also add to offline table with editedFlag
    if (!online) {
      realmService.addOfflineData(newItem);
      showSuccess('Changes saved offline');
    }

    // If online, call API
    if (online) {
      const { editedFlag, id, ...rest } = newItem;
      try {
        const response = await apiRequest(
          'put',
          `${endpoint}/${newItem?.id}`,
          mapToApi(rest),
        );
        showSuccess(response?.data?.message);
      } catch (error) {
        throw error;
      }
    }

    return { data: { data: newItem } };
  }

  if (method === 'delete') {
    if (online) {
      // If online, call API
      const response = await apiRequest('delete', `${endpoint}/${id}`);
      showSuccess(response?.data?.message);
    } else {
      // If offline, add to offline table with deletedFlag
      realmService.addOfflineData({ id, [deletedFlagKey]: true });
      showSuccess('Deleted successfully');
    }

    // Always remove from local DB
    realmService.removeOnlineData(id);

    return { data: { id } };
  }

  throw new Error('Invalid method');
};

export default manageGenericReponse;

// export interface SyncAndFetchParams {
//   endpoint: string;
//   realmService: any;
//   forceRefresh?: boolean;
//   deletedFlagKey?: string;
//   editedFlagKey?: string;
//   dataKey?: string;
//   mapToApi?: (item: any) => any;
// }

// export interface AddGenericParams<T> {
//   endpoint: string;
//   realmService: any;
//   values: T;
//   mapToApi?: (item: T) => any;
// }

// export interface DeleteGenericParams {
//   endpoint: string;
//   realmService: any;
//   id: string;
//   deletedFlagKey?: string;
// }

// const syncAndFetchGeneric = async ({
//   endpoint,
//   realmService,
//   deletedFlagKey = 'deletedFlag',
//   editedFlagKey = 'editedFlag',
//   forceRefresh = false,
//   dataKey = 'data',
//   mapToApi = item => item,
// }: SyncAndFetchParams) => {
//   const online = await isOnline();
//   const localData = await realmService.getOnlineData();
//   const offline = await realmService.getOfflineData();

//   // Track fetch per endpoint
//   if (hasFetchedOnceMap[endpoint] === undefined)
//     hasFetchedOnceMap[endpoint] = false;
//   let needApiFetch = online && (!hasFetchedOnceMap[endpoint] || forceRefresh);

//   try {
//     // Sync unsynced data if online
//     if (online) {
//       for (const item of offline || []) {
//         if (item?.[deletedFlagKey]) {
//           // Deleted: call DELETE
//           await client({
//             method: 'delete',
//             url: `${endpoint}/${item?.id}`,
//           });
//         } else if (item?.[editedFlagKey]) {
//           // Edited: call PUT
//           const { [editedFlagKey]: _, ...rest } = item;

//           const isDateId = /^\d+$/.test(item?.id); // true if id is all digits (Date.now().toString())
//           if (isDateId) {
//             const { [editedFlagKey]: _, id, ...rest } = item;
//             // New item, call POST
//             await client({
//               method: 'post',
//               url: endpoint,
//               data: mapToApi(rest),
//             });
//           } else {
//             // Existing item, call PUT
//             await client({
//               method: 'put',
//               url: `${endpoint}/${item?.id}`,
//               data: mapToApi(rest),
//             });
//           }
//         } else {
//           // New: call POST
//           await client({
//             method: 'post',
//             url: endpoint,
//             data: mapToApi(item),
//           });
//         }
//         needApiFetch = true;
//       }
//     }

//     // Fetch from API only once per session, after sync, or if forced
//     if (needApiFetch) {
//       const response = await client({
//         method: 'get',
//         url: endpoint,
//       });
//       const apiData = response?.data?.[dataKey] || [];
//       realmService.deleteAllOnlineData();
//       realmService.deleteAllOfflineData();
//       realmService.saveAllOnlineData(apiData);
//       hasFetchedOnceMap[endpoint] = true;
//       showSuccess('Synced and fetched successfully');
//       return { data: { [dataKey]: apiData } };
//     }

//     // Just return local data if no API fetch needed
//     return { data: { [dataKey]: localData } };
//   } catch (error) {
//     showError(error?.response?.data?.error || 'Something went wrong');
//     return { data: { [dataKey]: [] }, error };
//   }
// };

// const addGenericResponse = async <T>({
//   endpoint,
//   realmService,
//   values,
//   mapToApi = (item: T) => item,
// }: AddGenericParams<T>) => {
//   const online = await isOnline();

//   const newItem: any = {
//     id: Date.now().toString(),
//     ...values,
//   };

//   realmService.addOnlineData(newItem);

//   // If offline, also add to offline table
//   if (!online) {
//     realmService.addOfflineData(newItem);
//   }

//   if (online) {
//     const { id, ...rest } = newItem;
//     try {
//       const response = await client({
//         method: 'post',
//         url: endpoint,
//         data: mapToApi(rest),
//       });
//       showSuccess(response?.data?.message);
//     } catch (error) {
//       throw error;
//     }
//   }

//   return { data: { data: newItem } };
// };

// const deleteGenericResponse = async ({
//   endpoint,
//   realmService,
//   id,
//   deletedFlagKey = 'deletedFlag',
// }: DeleteGenericParams) => {
//   const online = await isOnline();

//   if (online) {
//     const response = await client({
//       method: 'delete',
//       url: `${endpoint}/${id}`,
//     });
//     showSuccess(response?.data?.message);
//   } else {
//     realmService.addOfflineData({ id, [deletedFlagKey]: true });
//     showSuccess('Deleted successfully');
//   }
//   realmService.removeOnlineData(id);
// };

// const editGenericResponse = async <T>({
//   endpoint,
//   realmService,
//   values,
//   mapToApi = (item: T) => item,
// }: AddGenericParams<T>) => {
//   const online = await isOnline();

//   const newItem: any = {
//     id: values?.id || Date.now().toString(),
//     ...values,
//     editedFlag: !online, // Set flag only if offline
//   };

//   realmService.addOnlineData(newItem);

//   // If offline, also add to offline table with editedFlag
//   if (!online) {
//     realmService.addOfflineData(newItem);
//     showSuccess('Changes saved offline');
//   }

//   if (online) {
//     const { editedFlag, id, ...rest } = newItem;
//     try {
//       const response = await client({
//         method: 'put',
//         url: `${endpoint}/${newItem?.id}`,
//         data: mapToApi(rest),
//       });
//       showSuccess(response?.data?.message);
//     } catch (error) {
//       throw error;
//     }
//   }

//   return { data: { data: newItem } };
// };

// export {
//   syncAndFetchGeneric,
//   addGenericResponse,
//   deleteGenericResponse,
//   editGenericResponse,
// };

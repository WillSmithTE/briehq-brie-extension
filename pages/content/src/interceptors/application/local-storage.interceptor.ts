import { MessageType, RecordSource, RecordType, safePostMessage } from '@extension/shared';

// Get all localStorage data
export const interceptLocalStorage = () => {
  const timestamp = Date.now();
  const localStorageData = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue; // Skip null keys

    const value = localStorage.getItem(key);
    localStorageData.push({
      key,
      value,
    });
  }

  safePostMessage(MessageType.ADD_RECORD, { timestamp, recordType: RecordType.LOCAL_STORAGE, source: RecordSource.CLIENT, items: localStorageData });
};

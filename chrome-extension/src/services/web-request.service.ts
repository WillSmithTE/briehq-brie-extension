import type { WebRequest } from 'webextension-polyfill';

import { EventType, RecordSource, RecordType, safeStructuredClone } from '@extension/shared';

import { addOrMergeRecords } from '@src/utils';

export const handleOnBeforeRequest = (request: WebRequest.OnBeforeRequestDetailsType) => {
  addOrMergeRecords(request.tabId, {
    recordType: RecordType.NETWORK,
    source: RecordSource.BACKGROUND,
    ...safeStructuredClone(request),
  });
};

export const handleOnBeforeSendHeaders = (request: WebRequest.OnBeforeSendHeadersDetailsType) => {
  addOrMergeRecords(request.tabId, {
    recordType: RecordType.NETWORK,
    source: RecordSource.BACKGROUND,
    ...safeStructuredClone(request),
  });
};

export const handleOnCompleted = (request: WebRequest.OnCompletedDetailsType) => {
  const clonedRequest = safeStructuredClone(request);

  addOrMergeRecords(clonedRequest.tabId, {
    recordType: RecordType.NETWORK,
    source: RecordSource.BACKGROUND,
    ...clonedRequest,
  });

  if (clonedRequest.statusCode >= 400) {
    addOrMergeRecords(clonedRequest.tabId, {
      timestamp: Date.now(),
      type: EventType.LOG,
      recordType: RecordType.CONSOLE,
      source: RecordSource.BACKGROUND,
      method: 'error',
      args: [
        `[${clonedRequest.type}] ${clonedRequest.method} ${clonedRequest.url} responded with status ${clonedRequest.statusCode}`,
        clonedRequest,
      ],
      stackTrace: {
        parsed: 'interceptFetch',
        raw: '',
      },
      url: clonedRequest.url,
    });
  }
};

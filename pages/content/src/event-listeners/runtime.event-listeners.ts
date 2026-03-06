import { CustomEventName, MessageAction } from '@extension/shared';

import { cleanup, startScreenshotCapture } from '@src/capture';

export const addRuntimeEventListeners = () => {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === MessageAction.AUTH_STATUS) {
      window.dispatchEvent(new CustomEvent(CustomEventName.AUTH_STATUS, { detail: msg.payload }));
    }

    if (msg.action === MessageAction.START_SCREENSHOT) {
      window.dispatchEvent(new CustomEvent(CustomEventName.METADATA));

      startScreenshotCapture(msg.payload);
    }

    if (msg.action === MessageAction.EXIT_CAPTURE) {
      cleanup();
    }

    if (msg.action === MessageAction.CLOSE_MODAL) {
      window.dispatchEvent(new CustomEvent(CustomEventName.CLOSE_MODAL));
    }
  });
};

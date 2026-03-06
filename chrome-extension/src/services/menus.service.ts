import type { ContextMenus, Menus, Tabs } from 'webextension-polyfill';
import { contextMenus } from 'webextension-polyfill';

import { t } from '@extension/i18n';
import { CaptureState, CaptureType, MessageAction } from '@extension/shared';
import { captureStateStorage, captureTabStorage } from '@extension/storage';

import { sendMessageToTab } from '@src/utils';

export const addContextMenus = async (): Promise<void> => {
  try {
    try {
      await contextMenus.removeAll();
    } catch {
      // @todo
    }

    await contextMenus.create({
      id: 'capture_parent',
      title: t('extensionName'),
      contexts: ['all'],
    });

    const captureOptions: Array<{ id: `${CaptureType}`; title: string }> = [
      { id: CaptureType.AREA, title: t('area') },
      { id: CaptureType.FULL_PAGE, title: t('fullPage') },
      { id: CaptureType.VIEWPORT, title: t('viewport') },
    ];

    await Promise.all(
      captureOptions.map(({ id, title }) =>
        contextMenus.create({
          id,
          parentId: 'capture_parent',
          title,
          contexts: ['all'],
        }),
      ),
    );
  } catch (e) {
    console.error('[background] ensureContextMenus error:', e);
  }
};

export const handleOnContextMenuClicked = async (info: Menus.OnClickData, tab?: Tabs.Tab) => {
  try {
    const tabId = tab?.id;
    if (!tabId) return;

    const type = info.menuItemId as `${CaptureType}`;
    if (!Object.values(CaptureType).includes(type as CaptureType)) return;

    await captureStateStorage.setCaptureState(CaptureState.CAPTURING);
    await captureTabStorage.setCaptureTabId(tabId);

    await sendMessageToTab(tabId, { action: MessageAction.START_SCREENSHOT, payload: { type } });
  } catch (e) {
    console.error('[background] onContextMenuClicked error:', e);
  }
};

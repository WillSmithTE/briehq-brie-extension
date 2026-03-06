import {
  MessageType,
  MessageAction,
  CaptureType as CaptureTypeEnum,
  CaptureState as CaptureStateEnum,
  RecordType as RecordTypeEnum,
} from '@extension/shared';

export type CaptureType = `${CaptureTypeEnum}`;
export type CaptureState = `${CaptureStateEnum}`;

export type BgMessage =
  | { type: MessageType.EXIT_CAPTURE }
  | { type: MessageType.ADD_RECORD; data: unknown }
  | { type: MessageType.GET_RECORDS }
  | { type: MessageType.DELETE_RECORDS }
  | { type: MessageType.AUTH_START }
  | { action: MessageAction.CHECK_NATIVE_CAPTURE }
  | { action: MessageAction.CAPTURE_VISIBLE_TAB };

export type BgResponse =
  | { status: 'success' }
  | { records: unknown[] }
  | { success: boolean; dataUrl?: string; message?: string }
  | { ok: boolean; error?: string }
  | { isAvailable: boolean };

export type RecordType = `${RecordTypeEnum}`;
export interface Record {
  recordType: RecordType;
  url: string;
  requestId?: string;
  requestBody?: {
    raw?: { bytes: ArrayBuffer }[];
    decoded?: any;
    parsed?: any;
  };
  type: string;
  domain?: string;
  [key: string]: any;
}

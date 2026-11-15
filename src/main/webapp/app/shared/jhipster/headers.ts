import { MESSAGE_ALERT_HEADER_NAME, MESSAGE_ERROR_HEADER_NAME, MESSAGE_PARAM_HEADER_NAME } from './constants';

export type HeaderMessage = {
  /** Success translation key or message */
  alert?: string;
  /** Success message */
  alertMessage?: string;

  /** Error translation key or message */
  error?: string;
  /** Error message */
  errorMessage?: string;
  /** Entity id for success messages. Entity name for error messages. */
  param?: string;
};

const headerToString = (headerValue: any): string | undefined => {
  if (headerValue === undefined) {
    return undefined;
  }
  if (Array.isArray(headerValue)) {
    if (headerValue.length > 1) {
      throw new TypeError('Multiple header values found');
    }
    headerValue = headerValue[0];
  }
  if (typeof headerValue !== 'string') {
    throw new TypeError('Header value is not a string');
  }
  return headerValue;
};

const decodeHeaderValue = (headerValue?: string): string | undefined =>
  headerValue ? decodeURIComponent(headerValue.replaceAll('+', ' ')) : headerValue;

export const getMessageFromHeaders = (headers: Record<string, any>): HeaderMessage => {
  const alertHeader = headerToString(headers[MESSAGE_ALERT_HEADER_NAME]);
  const errorHeader = headerToString(headers[MESSAGE_ERROR_HEADER_NAME]);

  return {
    alert: alertHeader,
    alertMessage: alertHeader,
    error: errorHeader,
    errorMessage: errorHeader,
    param: decodeHeaderValue(headerToString(headers[MESSAGE_PARAM_HEADER_NAME])),
  };
};

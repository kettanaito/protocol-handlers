import { UnsupportedProtocolError } from "./UnsupportedProtocolError";

export interface OpenUrlOptions {
  timeout?: number;
}

const DEFAULT_OPTIONS: OpenUrlOptions = {
  timeout: 1000,
};

export function openUrl(
  url: string | URL,
  options: OpenUrlOptions = {}
): Promise<void> {
  const resolvedUrl = new URL(url);
  const resolvedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  const protocolIsRegistered = new Promise<void>((resolve) => {
    window.addEventListener("blur", () => resolve());
  });

  const protocolIsUnknown = new Promise<void>((_, reject) => {
    setTimeout(() => {
      reject(new UnsupportedProtocolError(resolvedUrl.protocol));
    }, resolvedOptions.timeout);
  });

  window.location.assign(resolvedUrl);

  return Promise.race([protocolIsRegistered, protocolIsUnknown]);
}

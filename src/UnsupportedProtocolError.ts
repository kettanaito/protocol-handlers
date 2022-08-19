export class UnsupportedProtocolError extends Error {
  constructor(public readonly protocol: string) {
    super(`Unsupported protocol: ${protocol}`);
  }
}

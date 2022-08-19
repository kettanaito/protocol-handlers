# Protocol Handlers

Utilities to work with protocol handlers on the web.

## Why?

While the [Navigator API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator) provides methods to `.registerProtocolHandler()` and `.unregisterProtocolHandler()`, there's no way to check if a given protocol _has_ a handler. Instead, when trying to open a URL with an unsupported protocol the browser will throw an error that you cannot handle by any normal means (can be handled only in Firefox).

This package fills in the gap and provides API to work with protocol handlers.

## Install

```sh
npm install protocol-handlers
```

## API

### `openUrl`

Returns a promise that resolves if the given URL has successfuly opened (has a registered handler for its protocol) or rejects if it doesn't have a registered handler.

```ts
import { openUrl, UnsupportedProtocolError } from 'protocol-handlers'

// For example, try to open a Visual Studio Code Insiders URI.
// If that application is not installed, handle the rejection.
openUrl('vscode-insiders://resource').catch((error) => {
  if (error instanceof UnsupportedProtocolError) {
    console.log('The "%s" protocol is not supported!', error.protocol)
  }
})
```

#### Options

##### `timeout: number`

A custom timeout duration.

```ts
openUrl('my-app://resource', {
  // Wait for 2s for the navigation modal to appear
  // before rejecting this Promise.
  timeout: 2000,
})
```

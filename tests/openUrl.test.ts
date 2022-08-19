/**
 * @jest-environment jsdom
 */
import { openUrl } from '../src'
import { UnsupportedProtocolError } from '../src/UnsupportedProtocolError'

const originalLocation = window.location
const mockLocation = {
  assign: jest.fn(),
}

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    enumerable: true,
    value: mockLocation,
  })
})

afterEach(() => {
  mockLocation.assign.mockReset()
})

afterAll(() => {
  Object.defineProperty(window, 'location', {
    enumerable: true,
    value: originalLocation,
  })
})

it('resolves and opens a custom protocol if it has a handler', async () => {
  const result = openUrl('vscode://resource')

  // Emulate the blur event that would come from the open modal in the browser.
  setTimeout(() => {
    window.dispatchEvent(new Event('blur'))
  }, 500)

  await expect(result).resolves.toBeUndefined()
  expect(mockLocation.assign).toHaveBeenCalledWith(new URL('vscode://resource'))
})

it('rejects if the blur event happens after the timeout period', async () => {
  const result = openUrl('vscode://resource')

  // Emulate the blur event that would come from the open modal in the browser.
  setTimeout(() => {
    window.dispatchEvent(new Event('blur'))
  }, 1001)

  await expect(result).rejects.toThrow(new UnsupportedProtocolError('vscode:'))
  expect(mockLocation.assign).toHaveBeenCalledWith(new URL('vscode://resource'))
})

it('supports custom timeout duration', async () => {
  const result = openUrl('vscode://resource', { timeout: 2000 })

  // Emulate the blur event that would come from the open modal in the browser.
  setTimeout(() => {
    window.dispatchEvent(new Event('blur'))
  }, 1500)

  await expect(result).resolves.toBeUndefined()
  expect(mockLocation.assign).toHaveBeenCalledWith(new URL('vscode://resource'))
})

it('rejects if the given protocol does not have a handler', async () => {
  const result = openUrl('custom-protocol://resource')

  await expect(result).rejects.toThrow(
    new UnsupportedProtocolError('custom-protocol:')
  )
  // Even if there's no handler, there's no way to know that unless
  // we try navigating. So navigation must always happen.
  expect(mockLocation.assign).toHaveBeenCalledWith(
    new URL('custom-protocol://resource')
  )
})

/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

beforeEach(() => {
  jest.useFakeTimers();
  // Keep the test hermetic: never hit the CoinLore API from Jest.
  global.fetch = jest.fn(() =>
    Promise.resolve({json: () => Promise.resolve({data: []})}),
  ) as unknown as typeof fetch;
});

afterEach(() => {
  jest.useRealTimers();
});

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  await ReactTestRenderer.act(async () => {
    jest.advanceTimersByTime(600);
  });
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('api.coinlore.net/api/tickers'),
  );
  await ReactTestRenderer.act(() => {
    renderer?.unmount();
  });
});

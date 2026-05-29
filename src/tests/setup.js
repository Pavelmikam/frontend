import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

afterEach(() => {
  localStorage.clear();
});

// Mock navigator.geolocation (jsdom ne l'implémente pas)
Object.defineProperty(global.navigator, 'geolocation', {
  writable: true,
  value: {
    getCurrentPosition: vi.fn((success) =>
      success({ coords: { latitude: 3.8667, longitude: 11.5167 } })
    ),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
});

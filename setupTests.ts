import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './src/mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => server.close());

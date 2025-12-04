import { server } from "./mocks/server.js";
import "./mocks/localStorage.js";

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();
  localStorage.clear();
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();

  // restores all spyOn
  jest.restoreAllMocks();
});

// Clean up after the tests are finished.
afterAll(() => server.close());

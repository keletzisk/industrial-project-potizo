const localStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      // store[key] returns undefined. Localstorage.getItem returns null.
      return store[key] ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
    removeItem(key) {
      delete store[key];
    },
    getAll() {
      return store;
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

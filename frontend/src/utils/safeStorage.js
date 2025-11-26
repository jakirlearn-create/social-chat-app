const NOOP = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function _hasWindowStorage() {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch (err) {
    return false;
  }
}

const safeLocalStorage = _hasWindowStorage() ? window.localStorage : NOOP;

export default safeLocalStorage;

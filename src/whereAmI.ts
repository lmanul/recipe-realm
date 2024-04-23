/** @file Tiny utility function to check whether we are on the browser or server. */

const isClient = () => {
  return globalThis.window === globalThis;
};

export default isClient;
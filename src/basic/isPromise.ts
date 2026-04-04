function isPromise(obj) {
  return !!obj && typeof obj.then === 'function';
}

export default isPromise
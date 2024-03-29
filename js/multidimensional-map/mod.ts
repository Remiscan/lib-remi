export default class MultidimensionalMap {
  map: Map<any, any> = new Map();

  // set (...keys, value)
  set(...args: any[]) {
    const value = args.pop();
    let keys = args;

    let element = this.map;
    while (keys.length > 1) {
      const currentKey = keys.shift();
      if (!element.has(currentKey)) {
        element.set(currentKey, new Map());
      }
      element = element.get(currentKey)
    }
    element.set(keys[0], value);
  }

  get(...keys: any[]) {
    let element = this.map;
    while (keys.length > 0) {
      const currentKey = keys.shift();
      if (!element.has(currentKey)) return undefined;
      element = element.get(currentKey);
    }
    return element;
  }

  has(...keys: any[]) {
    let element = this.map;
    while (keys.length > 0) {
      const currentKey = keys.shift();
      if (!element.has(currentKey)) return false;
      element = element.get(currentKey);
    }
    return true;
  }

  delete(...keys: any[]) {
    while (keys.length > 0) {
      const currentKey = keys.pop();
      const currentValue = this.get(...keys);
      if (!currentValue) break;
      currentValue.delete(currentKey);
      if (currentValue.size > 0) break;
    }
  }
}
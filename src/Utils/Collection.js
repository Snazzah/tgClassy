// https://github.com/hydrabolt/discord.js/blob/master/src/util/Collection.js
class Collection extends Map {
  constructor(iterable) {
    super(iterable);

    Object.defineProperty(this, '_array', { value: null, writable: true, configurable: true });

    Object.defineProperty(this, '_keyArray', { value: null, writable: true, configurable: true });
  }

  set(key, val) {
    this._array = null;
    this._keyArray = null;
    return super.set(key, val);
  }

  delete(key) {
    this._array = null;
    this._keyArray = null;
    return super.delete(key);
  }

  array() {
    if (!this._array || this._array.length !== this.size) this._array = Array.from(this.values());
    return this._array;
  }

  keyArray() {
    if (!this._keyArray || this._keyArray.length !== this.size) this._keyArray = Array.from(this.keys());
    return this._keyArray;
  }

  keyValuePairs() {
    return this.keyArray().map(k=>[k, this.get(k)])
  }

  first(count) {
    if (count === undefined) return this.values().next().value;
    if (typeof count !== 'number') throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
    count = Math.min(this.size, count);
    const arr = new Array(count);
    const iter = this.values();
    for (let i = 0; i < count; i++) arr[i] = iter.next().value;
    return arr;
  }

  firstKey(count) {
    if (count === undefined) return this.keys().next().value;
    if (typeof count !== 'number') throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
    count = Math.min(this.size, count);
    const arr = new Array(count);
    const iter = this.iter();
    for (let i = 0; i < count; i++) arr[i] = iter.next().value;
    return arr;
  }

  last(count) {
    const arr = this.array();
    if (count === undefined) return arr[arr.length - 1];
    if (typeof count !== 'number') throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
    return arr.slice(-count);
  }

  lastKey(count) {
    const arr = this.keyArray();
    if (count === undefined) return arr[arr.length - 1];
    if (typeof count !== 'number') throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
    return arr.slice(-count);
  }

  random(count) {
    let arr = this.array();
    if (count === undefined) return arr[Math.floor(Math.random() * arr.length)];
    if (typeof count !== 'number') throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
    if (arr.length === 0) return [];
    const rand = new Array(count);
    arr = arr.slice();
    for (let i = 0; i < count; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    return rand;
  }

  randomKey(count) {
    let arr = this.keyArray();
    if (count === undefined) return arr[Math.floor(Math.random() * arr.length)];
    if (typeof count !== 'number') throw new TypeError('The count must be a number.');
    if (!Number.isInteger(count) || count < 1) throw new RangeError('The count must be an integer greater than 0.');
    if (arr.length === 0) return [];
    const rand = new Array(count);
    arr = arr.slice();
    for (let i = 0; i < count; i++) rand[i] = arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
    return rand;
  }

  findAll(prop, value) {
    if (typeof prop !== 'string') throw new TypeError('Key must be a string.');
    if (typeof value === 'undefined') throw new Error('Value must be specified.');
    const results = [];
    for (const item of this.values()) {
      if (item[prop] === value) results.push(item);
    }
    return results;
  }

  find(propOrFn, value) {
    if (typeof propOrFn === 'string') {
      if (typeof value === 'undefined') throw new Error('Value must be specified.');
      for (const item of this.values()) {
        if (item[propOrFn] === value) return item;
      }
      return null;
    } else if (typeof propOrFn === 'function') {
      for (const [key, val] of this) {
        if (propOrFn(val, key, this)) return val;
      }
      return null;
    } else {
      throw new Error('First argument must be a property string or a function.');
    }
  }

  findKey(propOrFn, value) {
    if (typeof propOrFn === 'string') {
      if (typeof value === 'undefined') throw new Error('Value must be specified.');
      for (const [key, val] of this) {
        if (val[propOrFn] === value) return key;
      }
      return null;
    } else if (typeof propOrFn === 'function') {
      for (const [key, val] of this) {
        if (propOrFn(val, key, this)) return key;
      }
      return null;
    } else {
      throw new Error('First argument must be a property string or a function.');
    }
  }

  exists(prop, value) {
    return Boolean(this.find(prop, value));
  }

  filter(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const results = new Collection();
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.set(key, val);
    }
    return results;
  }

  filterArray(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const results = [];
    for (const [key, val] of this) {
      if (fn(val, key, this)) results.push(val);
    }
    return results;
  }

  map(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    const arr = new Array(this.size);
    let i = 0;
    for (const [key, val] of this) arr[i++] = fn(val, key, this);
    return arr;
  }

  some(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (fn(val, key, this)) return true;
    }
    return false;
  }

  every(fn, thisArg) {
    if (thisArg) fn = fn.bind(thisArg);
    for (const [key, val] of this) {
      if (!fn(val, key, this)) return false;
    }
    return true;
  }

  reduce(fn, initialValue) {
    let accumulator;
    if (typeof initialValue !== 'undefined') {
      accumulator = initialValue;
      for (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
    } else {
      let first = true;
      for (const [key, val] of this) {
        if (first) {
          accumulator = val;
          first = false;
          continue;
        }
        accumulator = fn(accumulator, val, key, this);
      }
    }
    return accumulator;
  }

  clone() {
    return new this.constructor(this);
  }

  concat(...collections) {
    const newColl = this.clone();
    for (const coll of collections) {
      for (const [key, val] of coll) newColl.set(key, val);
    }
    return newColl;
  }

  deleteAll() {
    const returns = [];
    for (const item of this.values()) {
      if (item.delete) returns.push(item.delete());
    }
    return returns;
  }

  equals(collection) {
    if (!collection) return false;
    if (this === collection) return true;
    if (this.size !== collection.size) return false;
    return !this.find((value, key) => {
      const testVal = collection.get(key);
      return testVal !== value || (testVal === undefined && !collection.has(key));
    });
  }

  sort(compareFunction = (x, y) => +(x > y) || +(x === y) - 1) {
    return new Collection(Array.from(this.entries()).sort((a, b) => compareFunction(a[1], b[1], a[0], b[0])));
  }
}

module.exports = Collection;
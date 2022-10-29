const IDENTITY = (x) => x;

/**
 * Returns true if fun.(element) is truthy for all elements in iterable.
 *
 * If fun is not provided, returns true if all elements are truthy.
 */
export function all(iterable, fun = IDENTITY) {
  for (const element of iterable) {
    if (!fun(element)) {
      return false;
    }
  }
  return true;
}

/**
 * Returns true if fun.(element) is truthy for at least one element in iterable.
 *
 * If fun is not provided, returns true if at least one element is truthy.
 */
export function any(iterable, fun = IDENTITY) {
  for (const element of iterable) {
    if (fun(element)) {
      return true;
    }
  }
  return false;
}

/**
 * Finds the element at the given index (zero-based).
 */
export function at(iterable, n, defaultValue) {
  let count = 0;
  for (const item of iterable) {
    if (count++ === n) {
      return item;
    }
  }
  return defaultValue;
}

/**
 * Splits enumerable on every element for which fun returns a new value.
 */
export function* chunkBy(iterable, fun) {
  let current = [];
  let lastValue = undefined;
  for (const item of iterable) {
    const value = fun(item);
    if (value !== lastValue) {
      if (current.length > 0) {
        yield current;
      }
      current = [];
      lastValue = value;
    }
    current.push(item);
  }
  if (current.length > 0) {
    yield current;
  }
}

/**
 * Returns list of lists containing count elements each, where each new chunk
 * starts step elements into the enumerable.
 *
 * step is optional and, if not passed, defaults to count, i.e. chunks do not
 * overlap.
 */
export function* chunkEvery(iterable, count, step = count) {
  let currents = [];
  let i = 0;
  for (const item of iterable) {
    if (i++ % step === 0) currents.unshift([]);
    for (const current of currents) {
      current.push(item);
    }
    if (currents[currents.length - 1].length === count) {
      yield currents.pop();
    }
  }
  for (const current of currents) {
    yield current;
  }
}

/**
 * Given an enumerable of enumerables, concatenates the enumerables into a
 * single list.
 */
export function* concat(iterable) {
  for (const item of iterable) {
    yield* item;
  }
}

/**
 * Returns the count of elements in the enumerable for which fun returns a
 * truthy value.
 */
export function count(iterable, fun) {
  let count = 0;
  for (const element of iterable) {
    if (fun(element)) {
      count++;
    }
  }
  return count;
}

/**
 * Enumerates the enumerable, returning a list where all consecutive duplicated
 * elements are collapsed to a single element.
 *
 * An optional function can be passed to determine equality.
 */
export function* dedup(iterable, fun = IDENTITY) {
  let lastValue = undefined;
  for (const item of iterable) {
    const value = fun(item);
    if (value !== lastValue) {
      yield item;
      lastValue = value;
    }
  }
}

/**
 * Drops the amount of elements from the enumerable.
 */
export function* drop(iterable, n) {
  let count = 0;
  for (const item of iterable) {
    if (count++ >= n) {
      yield item;
    }
  }
}

/**
 * Returns a list of every nth element in the enumerable dropped, starting with
 * the first element.
 */
export function* dropEvery(iterable, n) {
  let count = 0;
  for (const item of iterable) {
    if (++count % n !== 0) {
      yield item;
    }
  }
}

/**
 * Drops elements at the beginning of the enumerable while fun returns a truthy
 * value.
 */
export function* dropWhile(iterable, fun) {
  let dropping = true;
  for (const item of iterable) {
    if (dropping && fun(item)) {
      continue;
    }
    dropping = false;
    yield item;
  }
}

/**
 * Invokes the given fun for each element in the enumerable.
 */
export function each(iterable, fun) {
  for (const item of iterable) {
    fun(item);
  }
}

/**
 * Determines if the enumerable is empty.
 */
export function empty(iterable) {
  for (const _ of iterable) {
    return false;
  }
  return true;
}

/**
 * Filters the enumerable, i.e. returns only those elements for which fun
 * returns a truthy value.
 */
export function* filter(iterable, fun) {
  for (const item of iterable) {
    if (fun(item)) {
      yield item;
    }
  }
}

/**
 * Returns the first element for which fun returns a truthy value. If no such
 * element is found, returns default.
 */
export function find(iterable, fun, defaultValue) {
  for (const item of iterable) {
    if (fun(item)) {
      return item;
    }
  }
  return defaultValue;
}

/**
 * Similar to find(), but returns the index (zero-based) of the element instead of the element itself.
 */
export function findIndex(iterable, fun) {
  let count = 0;
  for (const item of iterable) {
    if (fun(item)) {
      return count;
    }
    count++;
  }
}

/**
 * Similar to find/3, but returns the value of the function invocation instead of the element itself.
 */
export function findValue(iterable, fun, defaultValue) {
  for (const item of iterable) {
    const value = fun(item);
    if (value) {
      return value;
    }
  }
  return defaultValue;
}

/**
 * Maps the given fun over enumerable and flattens the result.
 */
export function* flatMap(iterable, fun) {
  for (const item of iterable) {
    yield* fun(item);
  }
}

/**
 * Returns a map with keys as unique elements of enumerable and values as the
 * count of every element.
 */
export function frequencies(iterable, fun = IDENTITY) {
  const map = new Map();
  for (const item of iterable) {
    const value = fun(item);
    const count = map.get(value) || 0;
    map.set(value, count + 1);
  }
  return map;
}

/**
 * Splits the enumerable into groups based on key_fun.
 *
 * The result is a map where each key is given by key_fun and each value is a
 * list of elements given by value_fun. The order of elements within each list
 * is preserved from the enumerable.
 */
export function groupBy(iterable, key_fun, value_fun = IDENTITY) {
  const map = new Map();
  for (const item of iterable) {
    const key = key_fun(item);
    const value = value_fun(item);
    const list = map.get(key) || [];
    list.push(value);
    map.set(key, list);
  }
  return map;
}

/**
 * Intersperses separator between each element of the enumeration.
 */
export function* intersperse(iterable, separator) {
  let first = true;
  for (const item of iterable) {
    if (first) {
      first = false;
    } else {
      yield separator;
    }
    yield item;
  }
}

/**
 * Returns true if fun.(element) is truthy for all elements in iterable.
 *
 * If fun is not provided, returns true if all elements are truthy.
 */
export function all(iterable, fun) {
  return empty(reject(iterable, fun));
}

/**
 * Returns true if fun.(element) is truthy for at least one element in iterable.
 *
 * If fun is not provided, returns true if at least one element is truthy.
 */
export function any(iterable, fun) {
  return !empty(filter(iterable, fun));
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
 * Splits iterable on every element for which fun returns a new value.
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
 * starts step elements into the iterable.
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
    if (currents[currents.length - 1]?.length === count) {
      yield currents[currents.length - 1];
      currents.pop();
    }
  }
  for (const current of currents) {
    yield current;
  }
}

/**
 * Given an iterable of iterables, concatenates the iterables into a
 * single iterable.
 */
export function* concat(iterable) {
  for (const item of iterable) {
    yield* item;
  }
}

/**
 * Returns the count of elements in the iterable for which fun returns a
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
 * Enumerates the iterable, returning a list where all consecutive duplicated
 * elements are collapsed to a single element.
 *
 * An optional function can be passed to determine equality.
 */
export function* dedup(iterable, fun) {
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
 * Drops the amount of elements from the iterable.
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
 * Returns a list of every nth element in the iterable dropped, starting with
 * the first element.
 */
export function* dropEvery(iterable, n) {
  return concat(map(chunkEvery(iterable, n), (it) => drop(it, 1)));
}

/**
 * Drops elements at the beginning of the iterable while fun returns a truthy
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
 * Invokes the given fun for each element in the iterable.
 */
export function each(iterable, fun) {
  for (const item of iterable) {
    fun(item);
  }
}

/**
 * Determines if the iterable is empty.
 */
export function empty(iterable) {
  for (const _ of iterable) {
    return false;
  }
  return true;
}

/**
 * Filters the iterable, i.e. returns only those elements for which fun
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
 * Maps the given fun over iterable and flattens the result.
 */
export function* flatMap(iterable, fun) {
  for (const item of iterable) {
    yield* fun(item);
  }
}

/**
 * Returns a map with keys as elements of iterable and values as the
 * count of every element.
 *
 * If a mapping function is given, the keys are the result of applying the
 * mapping function to the elements of iterable.
 */

export function frequencies(iterable, fun) {
  if (fun == undefined) {
    return frequencies(iterable, (x) => x);
  }
  const map = new Map();
  for (const item of iterable) {
    const value = fun(item);
    const count = map.get(value) || 0;
    map.set(value, count + 1);
  }
  return map;
}

/**
 * Splits the iterable into groups based on key_fun.
 *
 * The result is a map where each key is given by key_fun and each value is a
 * list of elements given by value_fun. The order of elements within each list
 * is preserved from the iterable.
 */

export function groupBy(iterable, key_fun, value_fun) {
  if (value_fun == undefined) {
    return groupBy(iterable, key_fun, (x) => x);
  }
  const map = new Map();
  for (const item of iterable) {
    const key = key_fun(item);
    const list = map.get(key) || [];
    list.push(value_fun(item));
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

/**
 * Returns a list where each element is the result of invoking fun on each corresponding element of enumerable.
 */
export function* map(iterable, fun) {
  for (const item of iterable) {
    yield fun(item);
  }
}

/**
 * Returns a list of results of invoking fun on every nth element of enumerable, starting with the first element.
 */
export function* mapEvery(
  iterable,
  n,
  fun,
) {
  let count = 0;
  for (const item of iterable) {
    if (++count % n === 0) {
      yield fun(item);
    } else {
      yield item;
    }
  }
}

/**
 * Maps and intersperses the given enumerable in one pass.
 */
export function* mapIntersperse(
  iterable,
  fun,
  separator,
) {
  let first = true;
  for (const item of iterable) {
    if (first) {
      first = false;
    } else {
      yield separator;
    }
    yield fun(item);
  }
}

/**
 * Returns the maximal element in the enumerable
 */
export function max(iterable, sorter = (a, b) => a <= b) {
  return reduce(iterable, (a, b) => (sorter(a, b) ? b : a));
}

/**
 * Returns the maximal element in the enumerable as calculated by the given fun.
 */
export function maxBy(iterable, fun, sorter = (a, b) => a <= b) {
  return reduce(iterable, (a, b) => (sorter(fun(a), fun(b)) ? a : b));
}

/**
 * Checks if element exists within the enumerable.
 */
export function member(iterable, element) {
  for (const item of iterable) {
    if (item === element) {
      return true;
    }
  }
  return false;
}

/**
 * Returns the minimal element in the enumerable
 */
export function min(iterable, sorter = (a, b) => a <= b) {
  return reduce(iterable, (a, b) => (sorter(a, b) ? a : b));
}

/**
 * Returns the minimal element in the enumerable as calculated by the given fun.
 */
export function minBy(iterable, fun, sorter = (a, b) => a <= b) {
  return reduce(iterable, (a, b) => (sorter(fun(a), fun(b)) ? a : b));
}

/**
 * Returns a tuple with the minimal and the maximal elements in the enumerable
 */
export function minMax(iterable, sorter = (a, b) => a <= b) {
  return reduce(
    map(iterable, (x) => [x, x]),
    ([min, max], [item, _item]) => [
      sorter(item, min) ? item : min,
      sorter(item, max) ? max : item,
    ],
  );
}

/**
 * Returns a tuple with the minimal and the maximal elements in the enumerable as calculated by the given fun.
 */
export function minMaxBy(iterable, fun, sorter = (a, b) => a <= b) {
  return reduce(
    map(iterable, (x) => [x, x]),
    ([min, max], [item, _item]) => [
      sorter(fun(item), fun(min)) ? item : min,
      sorter(fun(item), fun(max)) ? max : item,
    ],
  );
}

/**
 * Returns the product of all elements
 */
export function product(iterable) {
  return reduce(iterable, (a, b) => a * b, 1);
}

/**
 * Returns a random element of an enumerable.
 */
export function random(iterable) {
  const array = Array.from(iterable);
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Invokes fun for each element in the enumerable with the accumulator.
 *
 * If an initial accumulator is not given, the first element of the enumerable is used.
 */

export function reduce(iterable, fun, initial) {
  let acc = initial;
  for (const item of iterable) {
    if (acc === undefined) {
      acc = item;
    } else {
      acc = fun(acc, item);
    }
  }
  return acc;
}

/**
 * Returns a list of elements in enumerable excluding those for which the function fun returns a truthy value.
 */
export function reject(iterable, fun) {
  return filter(iterable, (x) => !fun(x));
}

/**
 * Returns a list of elements in enumerable excluding those for which the function fun returns a truthy value
 */
// function* reject()

/**
 * Return a sorted version of the enumerable.
 */

export function sort(iterable, sorter) {
  if (typeof sorter === "undefined") {
    return Array.from(iterable).sort((a, b) => a - b);
  } else {
    return Array.from(iterable).sort(sorter);
  }
}


/** Yield only the first n elements of iterable, then stops */
export function* take(iterable, n) {
  let count = 0;
  for (const item of iterable) {
    if (count++ >= n) {
      break;
    }
    yield item;
  }
}

/**
 * Returns true if fun.(element) is truthy for all elements in iterable.
 *
 * If fun is not provided, returns true if all elements are truthy.
 */
export function all<T>(iterable: Iterable<T>, fun: (x: T) => any = (x) => x) {
  return empty(reject(iterable, fun));
}

/**
 * Returns true if fun.(element) is truthy for at least one element in iterable.
 *
 * If fun is not provided, returns true if at least one element is truthy.
 */
export function any<T>(iterable: Iterable<T>, fun: (x: T) => any = (x) => x) {
  return !empty(filter(iterable, fun));
}

/**
 * Finds the element at the given index (zero-based).
 */
export function at<T>(iterable: Iterable<T>, n: number, defaultValue?: T) {
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
export function* chunkBy<T>(iterable: Iterable<T>, fun: (x: T) => any) {
  let current: T[] = [];
  let lastValue: any = undefined;
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
export function* chunkEvery<T>(
  iterable: Iterable<T>,
  count: number,
  step: number = count,
) {
  let currents: T[][] = [];
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
export function* concat<T>(iterable: Iterable<Iterable<T>>) {
  for (const item of iterable) {
    yield* item;
  }
}

/**
 * Returns the count of elements in the iterable for which fun returns a
 * truthy value.
 */
export function count<T>(iterable: Iterable<T>, fun: (x: T) => any = (x) => x) {
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
export function* dedup<T>(
  iterable: Iterable<T>,
  fun: (x: T) => any = (x) => x,
) {
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
export function* drop<T>(iterable: Iterable<T>, n: number) {
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
export function* dropEvery<T>(iterable: Iterable<T>, n: number) {
  return concat(map(chunkEvery(iterable, n), (it) => drop(it, 1)));
}

/**
 * Drops elements at the beginning of the iterable while fun returns a truthy
 * value.
 */
export function* dropWhile<T>(iterable: Iterable<T>, fun: (x: T) => any) {
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
export function each<T>(iterable: Iterable<T>, fun: (x: T) => any) {
  for (const item of iterable) {
    fun(item);
  }
}

/**
 * Determines if the iterable is empty.
 */
export function empty<T>(iterable: Iterable<T>) {
  for (const _ of iterable) {
    return false;
  }
  return true;
}

/**
 * Filters the iterable, i.e. returns only those elements for which fun
 * returns a truthy value.
 */
export function* filter<T>(iterable: Iterable<T>, fun: (x: T) => any) {
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
export function find<T>(
  iterable: Iterable<T>,
  fun: (x: T) => any,
  defaultValue?: T,
) {
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
export function findIndex<T>(iterable: Iterable<T>, fun: (x: T) => any) {
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
export function findValue<T, U>(
  iterable: Iterable<T>,
  fun: (x: T) => U,
  defaultValue?: U,
) {
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
export function* flatMap<T, U>(
  iterable: Iterable<T>,
  fun: (x: T) => Iterable<U>,
) {
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
function frequencies<T>(iterable: Iterable<T>): Map<T, number>;
function frequencies<T, U>(
  iterable: Iterable<T>,
  fun: (x: T) => U,
): Map<U, number>;

function frequencies<T, U>(iterable: Iterable<T>, fun?: (x: T) => U) {
  if (fun == undefined) {
    return frequencies(iterable, (x) => x);
  }
  const map = new Map<U, number>();
  for (const item of iterable) {
    const value = fun(item);
    const count = map.get(value) || 0;
    map.set(value, count + 1);
  }
  return map;
}

export { frequencies };

/**
 * Splits the iterable into groups based on key_fun.
 *
 * The result is a map where each key is given by key_fun and each value is a
 * list of elements given by value_fun. The order of elements within each list
 * is preserved from the iterable.
 */
function groupBy<T, U>(
  iterable: Iterable<T>,
  key_fun: (x: T) => U,
): Map<U, T[]>;

function groupBy<T, U, V>(
  iterable: Iterable<T>,
  key_fun: (x: T) => U,
  value_fun: (x: T) => V,
): Map<U, V[]>;

function groupBy<T, U, V>(
  iterable: Iterable<T>,
  key_fun: (x: T) => U,
  value_fun?: (x: T) => V,
) {
  if (value_fun == undefined) {
    return groupBy(iterable, key_fun, (x) => x);
  }
  const map = new Map<U, V[]>();
  for (const item of iterable) {
    const key = key_fun(item);
    const list = map.get(key) || [];
    list.push(value_fun(item));
    map.set(key, list);
  }
  return map;
}

export { groupBy };

/**
 * Intersperses separator between each element of the enumeration.
 */
export function* intersperse<T>(iterable: Iterable<T>, separator: T) {
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
export function* map<T, U>(iterable: Iterable<T>, fun: (x: T) => U) {
  for (const item of iterable) {
    yield fun(item);
  }
}

/**
 * Returns a list of results of invoking fun on every nth element of enumerable, starting with the first element.
 */
export function* mapEvery<T, U>(
  iterable: Iterable<T>,
  n: number,
  fun: (x: T) => U,
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
export function* mapIntersperse<T, U>(
  iterable: Iterable<T>,
  fun: (x: T) => U,
  separator: U,
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
export function max<T>(iterable: Iterable<T>, sorter = (a: T, b: T) => a <= b) {
  return reduce(iterable, (a: T, b: T) => (sorter(a, b) ? b : a));
}

/**
 * Returns the maximal element in the enumerable as calculated by the given fun.
 */
export function maxBy<T, U>(
  iterable: Iterable<T>,
  fun: (x: T) => U,
  sorter = (a: U, b: U) => a <= b,
) {
  return reduce(iterable, (a: T, b: T) => (sorter(fun(a), fun(b)) ? a : b));
}

/**
 * Checks if element exists within the enumerable.
 */
export function member<T>(iterable: Iterable<T>, element: T) {
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
export function min<T>(iterable: Iterable<T>, sorter = (a: T, b: T) => a <= b) {
  return reduce(iterable, (a: T, b: T) => (sorter(a, b) ? a : b));
}

/**
 * Returns the minimal element in the enumerable as calculated by the given fun.
 */
export function minBy<T, U>(
  iterable: Iterable<T>,
  fun: (x: T) => U,
  sorter = (a: U, b: U) => a <= b,
) {
  return reduce(iterable, (a: T, b: T) => (sorter(fun(a), fun(b)) ? a : b));
}

/**
 * Returns a tuple with the minimal and the maximal elements in the enumerable
 */
export function minMax<T>(
  iterable: Iterable<T>,
  sorter = (a: T, b: T) => a <= b,
) {
  return reduce(
    map(iterable, (x) => [x, x] as [T, T]),
    ([min, max], [item, _item]) =>
      [
        sorter(item, min) ? item : min,
        sorter(item, max) ? max : item,
      ] as [T, T],
  );
}

/**
 * Returns a tuple with the minimal and the maximal elements in the enumerable as calculated by the given fun.
 */
export function minMaxBy<T, U>(
  iterable: Iterable<T>,
  fun: (x: T) => U,
  sorter = (a: U, b: U) => a <= b,
) {
  return reduce(
    map(iterable, (x) => [x, x] as [T, T]),
    ([min, max], [item, _item]) =>
      [
        sorter(fun(item), fun(min)) ? item : min,
        sorter(fun(item), fun(max)) ? max : item,
      ] as [T, T],
  );
}

/**
 * Returns the product of all elements
 */
export function product(iterable: Iterable<number>) {
  return reduce(iterable, (a, b) => a * b, 1);
}

/**
 * Returns a random element of an enumerable.
 */
export function random<T>(iterable: Iterable<T>) {
  const array = Array.from(iterable);
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Invokes fun for each element in the enumerable with the accumulator.
 *
 * If an initial accumulator is not given, the first element of the enumerable is used.
 */
function reduce<T>(
  iterable: Iterable<T>,
  fun: (acc: T, x: T) => T,
): T;

function reduce<T, U>(
  iterable: Iterable<T>,
  fun: (acc: U, x: T) => U,
  initial: U,
): U;

function reduce(iterable, fun, initial?) {
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

export { reduce };

/**
 * Returns a list of elements in enumerable excluding those for which the function fun returns a truthy value.
 */
export function reject<T>(iterable: Iterable<T>, fun: (x: T) => boolean) {
  return filter(iterable, (x) => !fun(x));
}

/**
 * Returns a list of elements in enumerable excluding those for which the function fun returns a truthy value
 */
// function* reject()

/**
 * Return a sorted version of the enumerable.
 */
function sort(iterable: Iterable<number>): number[];
function sort<T>(iterable: Iterable<T>, sorter: (a: T, b: T) => number): T[];

function sort<T>(iterable: Iterable<T>, sorter?: (a: T, b: T) => number) {
  if (sorter == undefined) {
    return Array.from(iterable as Iterable<number>).sort((a, b) => a - b);
  } else {
    return Array.from(iterable).sort(sorter);
  }
}

export { sort };

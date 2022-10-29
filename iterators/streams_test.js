import { assertEquals } from "https://deno.land/std@0.160.0/testing/asserts.ts";

import { concat, filter, map, reduce, take } from "./streams.js";

function* listToStream(list) {
  for (const el of list) {
    yield el;
  }
}

Deno.test("map", () => {
  const source = listToStream([1, 2, 3, 4, 5]);
  const result = [...map(source, (x) => x * 2)];
  assertEquals(result, [2, 4, 6, 8, 10]);
});

Deno.test("filter", () => {
  const source = listToStream([1, 2, 3, 4, 5]);
  const result = [...filter(source, (x) => x % 2 === 0)];
  assertEquals(result, [2, 4]);
});

Deno.test("reduce", () => {
  const source = listToStream([1, 2, 3, 4, 5]);
  const result = reduce(source, (x, y) => x + y, 0);
  assertEquals(result, 15);
});

Deno.test("take", () => {
  const source = listToStream([1, 2, 3, 4, 5]);
  const result = [...take(source, 3)];
  assertEquals(result, [1, 2, 3]);
});

Deno.test("concat", () => {
  const source = listToStream([listToStream([1, 2]), listToStream([3, 4])]);
  const result = [...concat(source)];
  assertEquals(result, [1, 2, 3, 4]);
});

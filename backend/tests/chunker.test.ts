import { test, expect } from "vitest";
import { chunkText } from "../services/chunker.js";

test("splits text into chunks with expected overlap", () => {
  const actual = chunkText("abcdefghi", 5, 2);
  const expected = ["abcde", "defgh", "ghi"];
  expect(actual).toEqual(expected);
});

test("returns a single chunk when text is less than chunk size", () => {
  const actual = chunkText("abc", 5, 2);
  const expected = ["abc"];
  expect(actual).toEqual(expected);
});

test("handles empty text", () => {
  const actual = chunkText("", 5, 2);

  expect(actual).toEqual([]);
});

test("splits text into chunks with expected overlap when text ends on chunk boundary", () => {
  const actual = chunkText("abcdefghij", 5, 2);
  const expected = ["abcde", "defgh", "ghij"];
  expect(actual).toEqual(expected);
});

test("splits text into chunks with expected overlap when end index of chunk equals text length", () => {
  const actual = chunkText("abcde", 5, 2);
  const expected = ["abcde"];
  expect(actual).toEqual(expected);
});

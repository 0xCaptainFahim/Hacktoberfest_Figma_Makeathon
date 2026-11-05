import assert from "node:assert/strict";
import { test } from "node:test";
import { allMentors, findMentor, matchMentors } from "../src/match.js";

const ids = (skills) => matchMentors(skills).map((mentor) => mentor.id);

test("catalog lookup", () => {
  assert.equal(allMentors().length, 6);
  assert.equal(findMentor("m1")?.name, "Nadia Rahman");
  assert.equal(findMentor("missing"), undefined);
});

test("exact and case-insensitive skills rank the right mentors", () => {
  assert.deepEqual(ids(["terraform", "aws"]), ["m1"]);
  assert.deepEqual(ids(["AWS"]), ["m1"]);
  assert.deepEqual(ids("AWS"), ["m1"]);
  assert.deepEqual(ids(["siem"]), ["m3", "m4"]);
  assert.deepEqual(ids(["python"]), ["m3", "m6"]);
  assert.deepEqual(ids(["OWASP"]), ["m2"]);
  assert.deepEqual(ids(["prompt injection"]), ["m6"]);
});

test("partial matches keep word boundaries", () => {
  assert.deepEqual(ids(["web"]), ["m2"]);
  assert.deepEqual(ids(["python3"]), ["m3", "m6"]);
  assert.deepEqual(ids(["ai"]), ["m6"]);
  assert.deepEqual(ids(["java"]), []);
  assert.deepEqual(ids(["c"]), []);
  assert.deepEqual(ids(["ml"]), []);
});

test("empty, repeated, and non-string skills do not inflate the ranking", () => {
  assert.deepEqual(ids([]), []);
  assert.deepEqual(ids(null), []);
  assert.deepEqual(ids(undefined), []);
  assert.deepEqual(ids(["aws", 1, null, "terraform"]), ["m1"]);
  // Repeating python must not rank those mentors above Nadia, who matches aws once.
  assert.deepEqual(ids(["python", "python", "aws"]), ["m1", "m3", "m6"]);
});

test("returns at most three mentors, highest score first", () => {
  assert.deepEqual(
    ids(["aws", "owasp", "python", "siem", "privacy", "ai security"]),
    ["m3", "m6", "m1"]
  );
});

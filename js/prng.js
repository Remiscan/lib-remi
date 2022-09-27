/**
 * License: public domain
 * from https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */

/* Pseudorandom number generators */

export function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

/* Seed generating functions */

export function xmur3a(str) {
  for(var k, i = 0, h = 2166136261 >>> 0; i < str.length; i++) {
    k = Math.imul(str.charCodeAt(i), 3432918353); k = k << 15 | k >>> 17;
    h ^= Math.imul(k, 461845907); h = h << 13 | h >>> 19;
    h = Math.imul(h, 5) + 3864292196 | 0;
  }
  h ^= str.length;
  return function() {
    h ^= h >>> 16; h = Math.imul(h, 2246822507);
    h ^= h >>> 13; h = Math.imul(h, 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  }
}
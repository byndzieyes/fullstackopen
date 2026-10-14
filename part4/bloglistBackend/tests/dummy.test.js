import { describe, test } from 'node:test';
import assert from 'assert';
import { dummy } from '../utils/list_helper.js';

const blogs = [];

describe('dummy', () => {
  test('dummy returns one', () => {
    const result = dummy(blogs);
    assert.strictEqual(result, 1);
  });
});

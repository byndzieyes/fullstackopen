import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import supertest from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import { initialUsers, usersInDb } from './test_helper.js';
import User from '../models/user.js';

const api = supertest(app);

describe('when there are initially some users saved', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(initialUsers);
  });

  test('GET /api/users returns as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('POST /api/users creates a new user', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'secret',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await usersInDb();
    assert.equal(usersAtEnd.length, initialUsers.length + 1);
    assert.ok(usersAtEnd.some((user) => user.username === newUser.username));
  });

  describe('user creation fails with proper statuscode and message if password is invalid', () => {
    test('POST /api/users fails if password is too short', async () => {
      const newUser = {
        username: 'testuser4',
        name: 'Short Password User',
        password: 'pw',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();
      assert.equal(usersAtEnd.length, initialUsers.length);
    });

    test('POST /api/users fails if password is missing', async () => {
      const newUser = {
        username: 'testuser5',
        name: 'Missing Password User',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();
      assert.equal(usersAtEnd.length, initialUsers.length);
    });
  });

  describe('user creation fails with proper statuscode and message if username is invalid', () => {
    test('POST /api/users fails with proper statuscode and message if username already taken (case insensitive)', async () => {
      const newUser = {
        username: 'TESTUSER1',
        name: 'Duplicate User',
        password: 'secret',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();
      assert.equal(usersAtEnd.length, initialUsers.length);
    });

    test('POST /api/users fails with proper statuscode and message if username is too short', async () => {
      const newUser = {
        username: 'tu',
        name: 'Short Username User',
        password: 'secret',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();
      assert.equal(usersAtEnd.length, initialUsers.length);
    });

    test('POST /api/users fails with proper statuscode and message if username is missing', async () => {
      const newUser = {
        name: 'Missing Username User',
        password: 'secret',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();
      assert.equal(usersAtEnd.length, initialUsers.length);
    });
  });

  describe('user creation fails with proper statuscode and message if name is invalid', () => {
    test('POST /api/users fails with proper statuscode and message if name is too short', async () => {
      const newUser = {
        username: 'testuser7',
        name: 'A',
        password: 'secret',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();
      assert.equal(usersAtEnd.length, initialUsers.length);
    });

    test('POST /api/users fails with proper statuscode and message if name is missing', async () => {
      const newUser = {
        username: 'testuser6',
        password: 'secret',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();
      assert.equal(usersAtEnd.length, initialUsers.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});

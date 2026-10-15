import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import logger from '../utils/logger.js';
import { initialBlogs, blogsInDb } from './test_helper.js';
import Blog from '../models/blog.js';

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe('Blog API tests', () => {
  test('GET /api/blogs returns as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('GET /api/blogs returns all blogs', async () => {
    const response = await api.get('/api/blogs');
    assert.equal(response.body.length, initialBlogs.length);
  });

  test('blog identifier is named id', async () => {
    const response = await api.get('/api/blogs').expect(200);

    assert.ok(response.body.length > 0);

    for (const blog of response.body) {
      assert.equal(typeof blog.id, 'string');
      assert.ok(blog.id.length > 0);
      assert.equal(Object.hasOwn(blog, '_id'), false);
    }
  });

  test('POST /api/blogs creates a new blog', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Some Author',
      url: 'https://example.com',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    assert.equal(blogsAtEnd.length, initialBlogs.length + 1);
    assert.ok(blogsAtEnd.some((blog) => blog.title === newBlog.title));
  });

  test('POST /api/blogs defaults likes to 0 if missing', async () => {
    const response = await api
      .post('/api/blogs')
      .send({
        title: 'Blog without likes',
        author: 'Some Author',
        url: 'https://example.com',
      })
      .expect(201);

    const savedBlog = await Blog.findById(response.body.id);

    assert.ok(savedBlog);
    assert.equal(savedBlog.likes, 0);
  });

  test('POST /api/blogs fails with status code 400 if title is missing', async () => {
    const newBlogWithoutTitle = {
      author: 'Some Author',
      url: 'https://example.com',
      likes: 5,
    };

    await api.post('/api/blogs').send(newBlogWithoutTitle).expect(400);
  });

  test('POST /api/blogs fails with status code 400 if url is missing', async () => {
    const newBlogWithoutUrl = {
      title: 'Blog without url',
      author: 'Some Author',
      likes: 5,
    };

    await api.post('/api/blogs').send(newBlogWithoutUrl).expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
});

import { describe, test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import logger from '../utils/logger.js';
import { initialBlogs, blogsInDb } from './test_helper.js';
import Blog from '../models/blog.js';

const api = supertest(app);

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

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

  test('GET /api/blogs returns blog identifiers named id', async () => {
    const response = await api.get('/api/blogs').expect(200);

    assert.ok(response.body.length > 0);

    for (const blog of response.body) {
      assert.equal(typeof blog.id, 'string');
      assert.ok(blog.id.length > 0);
      assert.equal(Object.hasOwn(blog, '_id'), false);
    }
  });

  describe('addition of a new blog', () => {
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

  describe('updating a blog', () => {
    test('PUT /api/blogs/:id updates likes and persists the result', async () => {
      const blogsAtStart = await blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepEqual(response.body, updatedData);
      const blogsAtEnd = await blogsInDb();
      assert.equal(blogsAtEnd.length, blogsAtStart.length);
      assert.deepEqual(
        blogsAtEnd.find((blog) => blog.id === blogToUpdate.id),
        updatedData,
      );
    });

    test('PUT /api/blogs/:id allows setting likes to zero', async () => {
      const [blogToUpdate] = await blogsInDb();

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ ...blogToUpdate, likes: 0 })
        .expect(200);

      const savedBlog = await Blog.findById(blogToUpdate.id);
      assert.equal(savedBlog.likes, 0);
    });

    test('PUT /api/blogs/:id fails with status code 404 if the blog does not exist', async () => {
      const blogsAtStart = await blogsInDb();
      const missingId = new mongoose.Types.ObjectId().toString();

      await api
        .put(`/api/blogs/${missingId}`)
        .send({ ...initialBlogs[0], likes: 20 })
        .expect(404);

      assert.deepEqual(await blogsInDb(), blogsAtStart);
    });

    test('PUT /api/blogs/:id fails with status code 400 if id is invalid', async () => {
      await api
        .put(`/api/blogs/invalid-id`)
        .send({ ...initialBlogs[0], likes: 20 })
        .expect(400);
    });

    test('PUT /api/blogs/:id fails with status code 400 for invalid likes and leaves the blog unchanged', async () => {
      const [blogToUpdate] = await blogsInDb();

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ ...blogToUpdate, likes: 'not-a-number' })
        .expect(400);

      const savedBlog = await Blog.findById(blogToUpdate.id);
      assert.deepEqual(savedBlog.toJSON(), blogToUpdate);
    });
  });

  describe('deletion of a blog', () => {
    test('DELETE /api/blogs/:id deletes a blog', async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await blogsInDb();
      assert.equal(blogsAtEnd.length, blogsAtStart.length - 1);
      assert.ok(blogsAtEnd.every((blog) => blog.id !== blogToDelete.id));
    });
  });
});

after(async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
});

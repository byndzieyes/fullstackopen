import express from 'express';
import Blog from '../models/blog.js';

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const BlogToUpdate = await Blog.findById(request.params.id);

  if (!BlogToUpdate) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  BlogToUpdate.title = title;
  BlogToUpdate.author = author;
  BlogToUpdate.url = url;
  BlogToUpdate.likes = likes;

  const updatedBlog = await BlogToUpdate.save();
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

export default blogsRouter;

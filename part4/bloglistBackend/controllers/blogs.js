import express from 'express';
import Blog from '../models/blog.js';

const blogsRouter = express.Router();

blogsRouter.get('/', (request, response) => {
  return Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  return blog.save().then((result) => {
    response.status(201).json(result);
  });
});

export default blogsRouter;

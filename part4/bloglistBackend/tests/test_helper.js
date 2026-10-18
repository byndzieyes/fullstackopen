import Blog from '../models/blog.js';
import User from '../models/user.js';

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John Doe',
    url: 'https://example.com/first-blog',
    likes: 5,
  },
  {
    title: 'Second Blog',
    author: 'Jane Smith',
    url: 'https://example.com/second-blog',
    likes: 10,
  },
  {
    title: 'Third Blog',
    author: 'Bob Johnson',
    url: 'https://example.com/third-blog',
    likes: 15,
  },
];

const initialUsers = [
  {
    username: 'testuser1',
    name: 'Test User 1',
    passwordHash: 'password1',
  },
  {
    username: 'testuser2',
    name: 'Test User 2',
    passwordHash: 'password2',
  },
  {
    username: 'testuser3',
    name: 'Test User 3',
    passwordHash: 'password3',
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

export { initialBlogs, initialUsers, blogsInDb, usersInDb };

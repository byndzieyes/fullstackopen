import Blog from '../models/blog.js';

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

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

export { initialBlogs, blogsInDb };

export const dynamic = "force-dynamic"; // 👈 This makes the page always dynamic

import Card from "@/components/Card";
import { client } from "../lib/sanity";

async function getBlogs() {
  const query = `*[_type == "blog"]{
    _id,
    title,
    "image": mainImage,
    "titleDescription": titleDescription,
    "slug": slug.current,
    "author": author->name
  }`;
  return await client.fetch(query);
}

type Blog = {
  _id: string;
  title: string;
  image: string;
  titleDescription: string;
  slug: string;
  author: string;
};

export default async function AllBlog() {
  const blogs = await getBlogs();
  console.log(blogs);

  return (
    <div className="container mx-auto max-w-6xl mt-[-30px] md:px-0 px-12 ">
      <div className="mt-5 text-center">
        <h1 className="text-black text-[40px] font-bold">Blog</h1>
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search blogs..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
          />
        </div>
      </div>

      <div className="mt-5 flex md:flex-row flex-col flex-wrap justify-center items-center md:justify-start cursor-pointer gap-x-6 gap-y-3">
      {blogs.length === 0 ? (
        <div className="mt-5 text-center text-gray-500">
          <p>No blogs available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="mt-5 flex md:flex-row flex-col flex-wrap justify-center items-center md:justify-start cursor-pointer gap-x-6 gap-y-3">
          {blogs.map((blog: Blog) => (
            <a href={`/blog/${blog.slug}`} key={blog._id}>
              <Card
                CoverImage={blog.image}
                Title={blog.title}
                Description={blog.titleDescription}
                Author={blog.author}
              />
            </a>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

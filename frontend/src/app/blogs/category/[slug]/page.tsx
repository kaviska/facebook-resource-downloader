import Card from "@/components/Card";
import { client } from "../../../lib/sanity";

async function getBlogsByCategory(category: string | undefined) {
  if (!category) {
    throw new Error("Category parameter is missing.");
  }

  const query = `
    *[_type == "blog" && count((categories[]->title)[@ == $category]) > 0]{
      _id,
      title,
      "image": mainImage,
      "titleDescription": titleDescription,
      "slug": slug.current,
      "author": author->name
    }
  `;

  const queryParams = { category };
  return await client.fetch(query, queryParams);
}

type Blog = {
  _id: string;
  title: string;
  image: string;
  titleDescription: string;
  slug: string;
  author: string;
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params; // Resolve the promise
  const decodedCategory = decodeURIComponent(resolvedParams.slug);
  console.log("Decoded category:", decodedCategory);

  const blogs = await getBlogsByCategory(decodedCategory);
  console.log(blogs);

  return (
    <div className="container mx-auto max-w-6xl mt-[-30px] md:px-0 px-12">
      <div className="mt-5 text-center">
        <h1 className="text-black text-[40px] font-bold">Blogs in &ldquo;{decodedCategory}&ldquo;</h1>
      </div>

      <div className="mt-5 flex md:flex-row flex-col flex-wrap justify-center items-center md:justify-start cursor-pointer gap-x-6 gap-y-3">
        {blogs.length === 0 ? (
          <div className="mt-5 text-center text-gray-500">
            <p>No blogs available in this category. Please check back later.</p>
          </div>
        ) : (
          blogs.map((blog: Blog) => (
            <a href={`/blog/${blog.slug}`} key={blog._id}>
              <Card
                CoverImage={blog.image}
                Title={blog.title}
                Description={blog.titleDescription}
                Author={blog.author}
              />
            </a>
          ))
        )}
      </div>
    </div>
  );
}
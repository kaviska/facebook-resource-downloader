import Image from "next/image";
import { client } from "../../lib/sanity";
import { urlFor } from "../../lib/sanity";
import { PortableText } from "@portabletext/react";
import FAQBlog from "@/components/FAQBlog";
import Temp from "@/components/Temp";
import Catalog from "@/components/Catalog";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function getBlogBySlug(slug: string[]) {
  const query = `*[_type == "blog" && slug.current == $slug]{
    ...,
    "author": author->name,
    "authorImage": author->image,
    "image": mainImage.asset->url,
    "metaTitle": metaTitle,
    "metaDescription": metaDescription,
    "sidebar": sidebar,
    "categories": categories[]->title
  }`;
  const queryParams = { slug };
  return await client.fetch(query, queryParams);
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);
  console.log("blog", blog);

  if (!blog || blog.length === 0) {
    return {
      title: "Blog Post",
      description: "Blog post description",
    };
  }

  return {
    title: blog[0].metaTitle || "Blog Post",
    description: blog[0].metaDescription || "Blog post description",
    openGraph: {
      title: blog[0].metaTitle || "Blog Post",
      description: blog[0].metaDescription || "Blog post description",
      images: [
        {
          url: blog[0].image,
          width: 1200,
          height: 630,
          alt: blog[0].metaTitle || "Blog Post",
        },
      ],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);

  const isSidebarAvailable = blog[0].sidebar !== false;
  const isDownloadAvailable = blog[0].download !== false;

  return (
    <div>
      {isDownloadAvailable && <Temp />}

      <div className="container mx-auto max-w-6xl md:px-0 px-4 mt-12">
        <h1 className="text-black text-[40px] font-bold">
          {blog[0].title}
        </h1>
      </div>

      <div className="page-content mt-5 flex container mx-auto max-w-6xl md:px-0 px-4 gap-10">
        {/* Main Content */}
        <div className={isSidebarAvailable ? "md:w-[75%] w-full" : "w-full"}>
          {blog[0].mainImage && (
            <img
              src={urlFor(blog[0].mainImage).url()}
              className="w-full object-cover rounded"
              alt=""
            />
          )}

          <div id="content" className="my-4 prose max-w-none">
            <PortableText
              value={blog[0].body}
              components={{
                types: {
                  image: ({ value }) => (
                    <img
                      src={urlFor(value.asset).url()}
                      alt={value.alt || "Blog Image"}
                      className="w-full max-h-[500px] object-cover rounded"
                    />
                  ),
                },
                block: {
                  h2: ({ children, value }) => (
                    <h2 id={value._key} className="scroll-mt-20 text-2xl font-bold my-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children, value }) => (
                    <h3 id={value._key} className="scroll-mt-20 text-xl font-semibold ml-4 my-2">
                      {children}
                    </h3>
                  ),
                  normal: ({ children }) => <p>{children}</p>,
                },
                
              }}
            />
          </div>

          {blog[0].faq && <FAQBlog faq={blog[0].faq} />}
        </div>

        {/* Sidebar */}
        {isSidebarAvailable && (
          <div className="md:w-[25%] hidden md:block sticky top-5 self-start">
            <Catalog blog={blog} />
            <hr className="my-3" />

            <div className="user-info mt-4">
              <h3 className="font-semibold my-3">Writer</h3>
              <div className="flex items-center gap-4">
                <Image
                  src={urlFor(blog[0].authorImage).url()}
                  alt="author-image"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span>{blog[0].author}</span>
              </div>
              <hr className="my-3" />
            </div>

            <div className="contributors mt-4">
              <h3 className="font-semibold mt-3">Published Date</h3>
              <p>{new Date(blog[0].publishedAt).toLocaleDateString()}</p>
            </div>
            <hr className="my-3" />

                       {Array.isArray(blog[0].categories) &&
              blog[0].categories.length > 0 && (
                <div className="categories mt-4">
                  <h3 className="font-semibold mt-3">Categories</h3>
                  <ul>
                    {blog[0].categories.map(
                      (category: string, index: number) => (
                        <li key={index}>
                          <a
                            href={`/blogs/category/${encodeURIComponent(category)}`}
                            className="text-blue-500 hover:underline"
                          >
                            {category}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            <hr className="my-3" />

            <div className="tags mt-4">
              <h3 className="font-semibold mt-3">Tags</h3>
              {blog[0].tags && blog[0].tags.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {blog[0].tags.map(
                    (
                      tag: { _ref?: string; _type?: string } | string,
                      index: number
                    ) => (
                      <li
                        key={index}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      >
                        {typeof tag === "object" && tag._ref
                          ? String(tag._ref)
                          : String(tag)}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No tags available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

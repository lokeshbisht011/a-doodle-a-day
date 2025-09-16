import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "@/components/layout/Layout";
import { Suspense } from "react";
import fs from "fs";
import path from "path";

export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const metaModule = await import(`@/content/blogs/${slug}-meta.js`);
    return metaModule.metadata;
  } catch (error) {
    return {
      title: "Doodle Not Found",
      description: "This blog post could not be found.",
    };
  }
}

export async function generateStaticParams() {
  const blogsDirectory = path.join(process.cwd(), "src", "content", "blogs");
  const filenames = fs.readdirSync(blogsDirectory);
  const slugs = filenames.map((filename) =>
    filename.replace(/\.jsx$/, "").replace(/-meta.js$/, "")
  );

  // Filter out the metadata files
  const uniqueSlugs = [...new Set(slugs)];

  return uniqueSlugs.map((slug) => ({
    slug,
  }));
}

const importBlogComponent = async (slug) => {
  try {
    const componentModule = await import(`@/content/blogs/${slug}.jsx`);
    return componentModule.default;
  } catch (error) {
    console.error(`Failed to import blog component for slug: ${slug}`, error);
    return null;
  }
};

const BlogPostPage = async ({ params }) => {
  const { slug } = params;
  const BlogComponent = await importBlogComponent(slug);

  if (!BlogComponent) {
    notFound();
  }

  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <BlogComponent />
      </Suspense>
    </Layout>
  );
};

export default BlogPostPage;

import React from 'react';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Layout from '@/components/layout/Layout';

const getBlogSlugs = () => {
  const blogsDirectory = path.join(process.cwd(), 'src', 'content', 'blogs');
  const filenames = fs.readdirSync(blogsDirectory);
  const slugs = filenames.map((filename) =>
    filename.replace(/\.jsx$/, "").replace(/-meta.js$/, "")
  );
  const uniqueSlugs = [...new Set(slugs)];
  return uniqueSlugs;
};

const BlogListPage = () => {
  const slugs = getBlogSlugs();

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Blog</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slugs.map((slug) => (
            <Link key={slug} href={`/blogs/${slug}`} passHref>
              <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <h2 className="text-xl font-semibold capitalize">{slug.replace(/-/g, ' ')}</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Read more about {slug.replace(/-/g, ' ')}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BlogListPage;
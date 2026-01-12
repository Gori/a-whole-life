import Link from 'next/link'
import { getPayloadClient } from '@/payload/client'
import PageLoader from './components/PageLoader'

export const revalidate = 0

export default async function HomePage() {
  const payload = await getPayloadClient()

  const posts = await payload.find({
    collection: 'blog-posts',
    where: {
      status: { equals: 'published' },
      deletedAt: { exists: false },
    },
    sort: '-publishedAt',
    limit: 5,
  })

  return (
    <PageLoader>
      <section className="py-20 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-semibold text-white">
            Recent Posts
          </h2>
          <Link href="/blog" className="text-lg text-zinc-400 hover:text-white">
            View all →
          </Link>
        </div>

        {posts.docs.length === 0 ? (
          <p className="text-xl text-zinc-500">No posts yet.</p>
        ) : (
          <div className="space-y-12">
            {posts.docs.map((post) => (
              <article key={post.id} className="border-b border-zinc-800 pb-12 last:border-0">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-3xl font-medium text-white hover:text-zinc-300">
                    {post.title}
                  </h3>
                </Link>
                {post.excerpt && (
                  <p className="mt-4 text-xl text-zinc-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex gap-6 text-base text-zinc-500">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  )}
                  {post.lifeAge && (
                    <span>Age {post.lifeAge}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageLoader>
  )
}

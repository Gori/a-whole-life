import Link from 'next/link'
import { getPayloadClient } from '@/payload/client'
import PageLoader from './components/PageLoader'
import { RichText } from './blog/[slug]/RichText'

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
      <section className="py-20 max-w-4xl xl:max-w-5xl mx-auto px-8">
        <div className="flex items-center justify-between mb-16">
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
          <div className="space-y-24">
            {posts.docs.map((post) => (
              <article key={post.id}>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-5xl lg:text-6xl font-bold text-white hover:text-zinc-300 mb-6">
                    {post.title}
                  </h3>
                </Link>
                <div className="mb-8 flex gap-6 text-lg text-zinc-500">
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
                <div className="prose prose-xl prose-invert max-w-none">
                  <RichText content={post.content} />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageLoader>
  )
}

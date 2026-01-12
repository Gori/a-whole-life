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
            {posts.docs.map((post) => {
              const categories = post.categories as Array<{ id: string; name: string; slug: string }> | undefined
              const tags = post.tags as Array<{ id: string; name: string; slug: string }> | undefined

              return (
                <article key={post.id}>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-5xl lg:text-6xl font-bold text-white hover:text-zinc-300 mb-6">
                      {post.title}
                    </h3>
                  </Link>
                  <div className="mb-6 flex gap-6 text-lg text-zinc-500">
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

                  {(categories?.length || tags?.length) && (
                    <div className="mb-8 flex flex-wrap gap-2">
                      {categories?.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/blog?category=${cat.slug}`}
                          className="text-sm px-3 py-1 bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700"
                        >
                          {cat.name}
                        </Link>
                      ))}
                      {tags?.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/blog?tag=${tag.slug}`}
                          className="text-sm px-3 py-1 border border-zinc-700 text-zinc-400 rounded hover:bg-zinc-800"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="prose prose-xl prose-invert max-w-none">
                    <RichText content={post.content} />
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </PageLoader>
  )
}

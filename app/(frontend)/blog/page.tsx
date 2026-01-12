import Link from 'next/link'
import Image from 'next/image'
import type { Where } from 'payload'
import { getPayloadClient } from '@/payload/client'
import { TimelineToggle } from './TimelineToggle'
import { FilterBar } from './FilterBar'

export const dynamic = 'force-dynamic'

type SearchParams = Promise<{
  order?: 'published' | 'life-date' | 'life-age'
  category?: string
  tag?: string
  page?: string
}>

export default async function BlogPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const payload = await getPayloadClient()

  const order = params.order || 'published'
  const categorySlug = params.category
  const tagSlug = params.tag
  const page = parseInt(params.page || '1', 10)
  const limit = 10

  // Get categories and tags for filter UI
  const [categories, tags] = await Promise.all([
    payload.find({ collection: 'categories', limit: 100 }),
    payload.find({ collection: 'tags', limit: 100 }),
  ])

  // Build where clause
  const whereConditions: Where['and'] = [
    { status: { equals: 'published' } },
    { deletedAt: { exists: false } },
  ]

  // Category filter
  if (categorySlug) {
    const category = categories.docs.find((c) => c.slug === categorySlug)
    if (category) {
      whereConditions.push({ categories: { contains: category.id } })
    }
  }

  // Tag filter
  if (tagSlug) {
    const tag = tags.docs.find((t) => t.slug === tagSlug)
    if (tag) {
      whereConditions.push({ tags: { contains: tag.id } })
    }
  }

  const where: Where = { and: whereConditions }

  // Determine sort order
  let sort: string
  switch (order) {
    case 'life-date':
      sort = '-lifeDate'
      break
    case 'life-age':
      sort = '-lifeAge'
      break
    default:
      sort = '-publishedAt'
  }

  const posts = await payload.find({
    collection: 'blog-posts',
    where,
    sort,
    page,
    limit,
  })

  return (
    <div className="py-20 max-w-4xl xl:max-w-5xl mx-auto px-8">
      <h1 className="text-4xl font-semibold text-white mb-8">
        Archive
      </h1>

      <div className="mb-12 space-y-4">
        <TimelineToggle currentOrder={order} />
        <FilterBar
          categories={categories.docs as Array<{ id: string | number; name: string; slug: string }>}
          tags={tags.docs as Array<{ id: string | number; name: string; slug: string }>}
          selectedCategory={categorySlug}
          selectedTag={tagSlug}
        />
      </div>

      {posts.docs.length === 0 ? (
        <p className="text-xl text-zinc-500">No posts found.</p>
      ) : (
        <>
          <div className="space-y-12">
            {posts.docs.map((post) => {
              const featuredImage = post.featuredImage as { url?: string; alt?: string } | undefined

              return (
                <article key={post.id} className="border-b border-zinc-800 pb-12 last:border-0">
                  {featuredImage?.url && (
                    <Link href={`/blog/${post.slug}`} className="block mb-6">
                      <Image
                        src={featuredImage.url}
                        alt={featuredImage.alt || post.title}
                        width={768}
                        height={400}
                        className="rounded-lg object-cover"
                      />
                    </Link>
                  )}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-3xl font-medium text-white hover:text-zinc-300">
                      {post.title}
                    </h2>
                  </Link>
                  {post.excerpt && (
                    <p className="mt-4 text-xl text-zinc-400 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-6 text-base text-zinc-500">
                    {post.publishedAt && (
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    )}
                    {post.lifeDate && (
                      <span>
                        Life: {new Date(post.lifeDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {post.lifeAge && (
                      <span>Age {post.lifeAge}</span>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {/* Pagination */}
          {posts.totalPages > 1 && (
            <nav className="mt-12 flex justify-center gap-2">
              {posts.hasPrevPage && (
                <Link
                  href={buildUrl({ order, category: categorySlug, tag: tagSlug, page: page - 1 })}
                  className="px-4 py-2 text-base border border-zinc-700 rounded hover:bg-zinc-800 text-zinc-300"
                >
                  Previous
                </Link>
              )}
              <span className="px-4 py-2 text-base text-zinc-500">
                Page {posts.page} of {posts.totalPages}
              </span>
              {posts.hasNextPage && (
                <Link
                  href={buildUrl({ order, category: categorySlug, tag: tagSlug, page: page + 1 })}
                  className="px-4 py-2 text-base border border-zinc-700 rounded hover:bg-zinc-800 text-zinc-300"
                >
                  Next
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  )
}

function buildUrl(params: { order?: string; category?: string; tag?: string; page?: number }) {
  const searchParams = new URLSearchParams()
  if (params.order && params.order !== 'published') searchParams.set('order', params.order)
  if (params.category) searchParams.set('category', params.category)
  if (params.tag) searchParams.set('tag', params.tag)
  if (params.page && params.page > 1) searchParams.set('page', params.page.toString())
  const query = searchParams.toString()
  return query ? `/blog?${query}` : '/blog'
}

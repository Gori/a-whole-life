import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getPayloadClient } from '@/payload/client'
import { RichText } from './RichText'
import { ImageGallery } from './ImageGallery'

export const dynamic = 'force-dynamic'

type Params = Promise<{ slug: string }>

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const posts = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
      deletedAt: { exists: false },
    },
    limit: 1,
  })

  const post = posts.docs[0]

  if (!post) {
    notFound()
  }

  const featuredImage = post.featuredImage as { url?: string; alt?: string; width?: number; height?: number } | undefined
  const categories = post.categories as Array<{ id: string; name: string; slug: string }> | undefined
  const tags = post.tags as Array<{ id: string; name: string; slug: string }> | undefined
  const gallery = post.gallery as Array<{ image: { url?: string; alt?: string }; caption?: string }> | undefined

  return (
    <article className="py-20 max-w-4xl xl:max-w-5xl mx-auto px-8">
      <header className="mb-12">
        <Link href="/blog" className="text-base text-zinc-400 hover:text-white mb-6 inline-block">
          &larr; Back to Archive
        </Link>
        <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6">
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-6 text-lg text-zinc-400">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              Published {new Date(post.publishedAt).toLocaleDateString('en-US', {
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

        {(categories?.length || tags?.length) && (
          <div className="mt-6 flex flex-wrap gap-2">
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
      </header>

      {featuredImage?.url && (
        <div className="mb-12">
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || post.title}
            width={featuredImage.width || 1200}
            height={featuredImage.height || 630}
            className="rounded-lg w-full"
            priority
          />
        </div>
      )}

      <div className="prose prose-xl prose-invert max-w-none">
        <RichText content={post.content} />
      </div>

      {gallery && gallery.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Gallery
          </h2>
          <ImageGallery images={gallery} />
        </div>
      )}
    </article>
  )
}

import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/payload/client'
import { RichText } from '../blog/[slug]/RichText'

export const dynamic = 'force-dynamic'

type Params = Promise<{ slug: string }>

// Reserved slugs that shouldn't be handled by the static pages route
const RESERVED_SLUGS = ['blog', 'admin', 'api']

export default async function StaticPage({ params }: { params: Params }) {
  const { slug } = await params

  // Don't handle reserved routes
  if (RESERVED_SLUGS.includes(slug)) {
    notFound()
  }

  const payload = await getPayloadClient()

  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const page = pages.docs[0]

  if (!page) {
    notFound()
  }

  return (
    <article>
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8">
        {page.title}
      </h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <RichText content={page.content} />
      </div>
    </article>
  )
}

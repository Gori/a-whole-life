'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type Order = 'published' | 'life-date' | 'life-age'

export function TimelineToggle({ currentOrder }: { currentOrder: Order }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (newOrder: Order) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newOrder === 'published') {
      params.delete('order')
    } else {
      params.set('order', newOrder)
    }
    // Reset to page 1 when changing order
    params.delete('page')
    const query = params.toString()
    router.push(query ? `/blog?${query}` : '/blog')
  }

  return (
    <div className="flex gap-2">
      <span className="text-sm text-zinc-500 mr-2">Order by:</span>
      <button
        onClick={() => handleChange('published')}
        className={`px-3 py-1 text-sm rounded ${
          currentOrder === 'published'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
        }`}
      >
        Published
      </button>
      <button
        onClick={() => handleChange('life-date')}
        className={`px-3 py-1 text-sm rounded ${
          currentOrder === 'life-date'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
        }`}
      >
        Life Date
      </button>
      <button
        onClick={() => handleChange('life-age')}
        className={`px-3 py-1 text-sm rounded ${
          currentOrder === 'life-age'
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
        }`}
      >
        Life Age
      </button>
    </div>
  )
}

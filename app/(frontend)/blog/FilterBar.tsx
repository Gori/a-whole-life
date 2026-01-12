'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface FilterBarProps {
  categories: Array<{ id: string | number; name: string; slug: string }>
  tags: Array<{ id: string | number; name: string; slug: string }>
  selectedCategory?: string
  selectedTag?: string
}

export function FilterBar({ categories, tags, selectedCategory, selectedTag }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    params.delete('page')
    const query = params.toString()
    router.push(query ? `/blog?${query}` : '/blog')
  }

  const handleTagChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) {
      params.set('tag', slug)
    } else {
      params.delete('tag')
    }
    params.delete('page')
    const query = params.toString()
    router.push(query ? `/blog?${query}` : '/blog')
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('tag')
    params.delete('page')
    const query = params.toString()
    router.push(query ? `/blog?${query}` : '/blog')
  }

  const hasFilters = selectedCategory || selectedTag

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {categories.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-500">Category:</label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => handleCategoryChange(e.target.value || null)}
            className="text-sm border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-500">Tag:</label>
          <select
            value={selectedTag || ''}
            onChange={(e) => handleTagChange(e.target.value || null)}
            className="text-sm border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          >
            <option value="">All</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

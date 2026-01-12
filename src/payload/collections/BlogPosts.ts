import type { CollectionConfig } from 'payload'

// Site owner's birth date - used to calculate lifeAge automatically
const BIRTH_DATE = new Date('1996-10-14')

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function calculateAge(birthDate: Date, eventDate: Date): number {
  let age = eventDate.getFullYear() - birthDate.getFullYear()
  const monthDiff = eventDate.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && eventDate.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'lifeDate'],
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title if left empty',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Click "Generate from content" to auto-fill',
        components: {
          Field: '@/payload/components/ExcerptField#ExcerptField',
        },
      },
    },
    // Life timeline fields
    {
      name: 'lifeDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'yyyy-MM-dd',
        },
        description: 'The date this memory/event occurred - lifeAge will be calculated automatically',
      },
    },
    {
      name: 'lifeAge',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Automatically calculated from lifeDate',
      },
    },
    // Categorization
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    // Images
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    // Publishing
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Defaults to now',
      },
    },
    // Soft delete
    {
      name: 'deletedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => !!data?.deletedAt,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (!data) return data

        // Auto-generate slug from title
        if ((operation === 'create' || operation === 'update') && data.title && !data.slug) {
          data.slug = generateSlug(data.title)
        }

        return data
      },
    ],
    beforeChange: [
      ({ data, operation }) => {
        if (!data) return data

        // Auto-set publishedAt to now if not set
        if (operation === 'create' && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        // Auto-calculate lifeAge from lifeDate
        if (data.lifeDate) {
          data.lifeAge = calculateAge(BIRTH_DATE, new Date(data.lifeDate))
        }

        return data
      },
    ],
  },
}

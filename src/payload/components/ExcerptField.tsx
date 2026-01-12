'use client'

import { useField, useFormFields, TextareaField } from '@payloadcms/ui'
import type { TextareaFieldClientProps } from 'payload'

function extractTextFromLexical(content: unknown): string {
  if (!content || typeof content !== 'object') return ''

  const root = (content as { root?: { children?: unknown[] } }).root
  if (!root?.children) return ''

  let text = ''
  const extractText = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    const n = node as { text?: string; children?: unknown[] }
    if (n.text) text += n.text + ' '
    if (n.children) n.children.forEach(extractText)
  }

  root.children.forEach(extractText)
  return text.trim()
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function ExcerptField(props: TextareaFieldClientProps) {
  const { value, setValue } = useField<string>({ path: props.path })
  const contentField = useFormFields(([fields]) => fields.content)

  const generateExcerpt = () => {
    const content = contentField?.value
    if (!content) {
      alert('Please add some content first')
      return
    }

    const text = extractTextFromLexical(content)
    if (!text) {
      alert('Could not extract text from content')
      return
    }

    const excerpt = truncateText(text, 500)
    setValue(excerpt)
  }

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <button
          type="button"
          onClick={generateExcerpt}
          style={{
            padding: '8px 16px',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Generate from content
        </button>
      </div>
      <TextareaField {...props} />
    </div>
  )
}

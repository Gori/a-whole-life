import type { JSX } from 'react'
import {
  type SerializedEditorState,
  type SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical'

interface RichTextProps {
  content: SerializedEditorState | null | undefined
}

export function RichText({ content }: RichTextProps) {
  if (!content || !content.root || !content.root.children) {
    return null
  }

  return <>{renderNodes(content.root.children)}</>
}

function renderNodes(nodes: SerializedLexicalNode[]): React.ReactNode {
  return nodes.map((node, index) => renderNode(node, index))
}

function renderNode(node: SerializedLexicalNode, index: number): React.ReactNode {
  const key = index

  switch (node.type) {
    case 'paragraph': {
      const paragraphNode = node as SerializedLexicalNode & { children?: SerializedLexicalNode[] }
      return (
        <p key={key}>
          {paragraphNode.children ? renderNodes(paragraphNode.children) : null}
        </p>
      )
    }
    case 'heading': {
      const headingNode = node as SerializedLexicalNode & { tag?: string; children?: SerializedLexicalNode[] }
      const Tag = (headingNode.tag || 'h2') as keyof JSX.IntrinsicElements
      return (
        <Tag key={key}>
          {headingNode.children ? renderNodes(headingNode.children) : null}
        </Tag>
      )
    }
    case 'text': {
      const textNode = node as SerializedLexicalNode & { text?: string; format?: number }
      let text: React.ReactNode = textNode.text || ''

      // Handle text formatting (bold, italic, etc.)
      if (textNode.format) {
        if (textNode.format & 1) text = <strong key={`${key}-bold`}>{text}</strong>
        if (textNode.format & 2) text = <em key={`${key}-italic`}>{text}</em>
        if (textNode.format & 8) text = <u key={`${key}-underline`}>{text}</u>
        if (textNode.format & 4) text = <s key={`${key}-strikethrough`}>{text}</s>
        if (textNode.format & 16) text = <code key={`${key}-code`}>{text}</code>
      }

      return <span key={key}>{text}</span>
    }
    case 'link': {
      const linkNode = node as SerializedLexicalNode & {
        fields?: { url?: string; newTab?: boolean }
        children?: SerializedLexicalNode[]
      }
      return (
        <a
          key={key}
          href={linkNode.fields?.url || '#'}
          target={linkNode.fields?.newTab ? '_blank' : undefined}
          rel={linkNode.fields?.newTab ? 'noopener noreferrer' : undefined}
        >
          {linkNode.children ? renderNodes(linkNode.children) : null}
        </a>
      )
    }
    case 'list': {
      const listNode = node as SerializedLexicalNode & {
        listType?: string
        children?: SerializedLexicalNode[]
      }
      const ListTag = listNode.listType === 'number' ? 'ol' : 'ul'
      return (
        <ListTag key={key}>
          {listNode.children ? renderNodes(listNode.children) : null}
        </ListTag>
      )
    }
    case 'listitem': {
      const listItemNode = node as SerializedLexicalNode & { children?: SerializedLexicalNode[] }
      return (
        <li key={key}>
          {listItemNode.children ? renderNodes(listItemNode.children) : null}
        </li>
      )
    }
    case 'quote': {
      const quoteNode = node as SerializedLexicalNode & { children?: SerializedLexicalNode[] }
      return (
        <blockquote key={key}>
          {quoteNode.children ? renderNodes(quoteNode.children) : null}
        </blockquote>
      )
    }
    case 'linebreak': {
      return <br key={key} />
    }
    default: {
      // For unknown node types, try to render children if they exist
      const unknownNode = node as SerializedLexicalNode & { children?: SerializedLexicalNode[] }
      if (unknownNode.children) {
        return <div key={key}>{renderNodes(unknownNode.children)}</div>
      }
      return null
    }
  }
}

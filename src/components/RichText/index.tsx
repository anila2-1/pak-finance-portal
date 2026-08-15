'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type SerializedUploadNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'

import {
  JSXConvertersFunction,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import Prism from 'prismjs'

// Prism languages
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import MediaBlock from '@/blocks/MediaBlock/Component'

import { getMediaUrl } from './../../lib/getMediaUrl'

/* =========================================================
   BLOCK TYPES
========================================================= */

type BannerBlockProps = {
  style?: 'info' | 'warning' | 'error' | 'success'
  content?: any
  id?: string
  blockName?: string
  blockType: 'banner'
}

type CTABlockProps = {
  richText?: any
  links?: any[]
  id?: string
  blockName?: string
  blockType: 'cta'
}

type MediaBlockProps = {
  resource?: {
    url?: string
    alt?: string
    filename?: string
  }
  className?: string
  imgClassName?: string
  id?: string
  blockType: 'mediaBlock'
}

type VideoBlockProps = {
  embedCode?: string
  caption?: string
  id?: string
  blockType: 'VideoBlock'
}

/*
 * IMPORTANT:
 * Keep this flexible because your exact highlightBox
 * fields may be different.
 */
type HighlightBoxBlockProps = {
  title?: string
  heading?: string
  text?: string
  description?: string
  content?: any

  variant?: 'info' | 'success' | 'warning' | 'danger' | 'tip'
  style?: string

  id?: string
  blockName?: string
  blockType: 'highlightBox'
}

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | BannerBlockProps
      | CTABlockProps
      | MediaBlockProps
      | VideoBlockProps
      | HighlightBoxBlockProps
      | CodeBlockProps
    >

/* =========================================================
   HELPERS
========================================================= */

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function isLexicalState(value: any): boolean {
  return Boolean(
    value && typeof value === 'object' && value.root && Array.isArray(value.root.children),
  )
}

function getImageUrl(value: any): string | null {
  if (!value) return null

  if (typeof value === 'string') {
    return getMediaUrl(value)
  }

  if (typeof value === 'object') {
    const url = value.url || value.src || value.filename || value.image?.url || value.image?.src

    if (url) {
      return getMediaUrl(url)
    }
  }

  return null
}

/* =========================================================
   INTERNAL LINK
========================================================= */

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields?.doc

  if (!doc?.value) {
    return '#'
  }

  const value = doc.value

  if (typeof value === 'object' && value?.slug) {
    switch (doc.relationTo) {
      case 'posts':
        return `/${value.slug}`

      case 'categories':
        return `/categories/${value.slug}`

      default:
        return `/${value.slug}`
    }
  }

  return '#'
}

/* =========================================================
   CODE STYLING
========================================================= */

const codeBlockStyle: React.CSSProperties = {
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  background: '#0f172a',
  color: '#e2e8f0',
  padding: '1.25rem',
  borderRadius: '0.875rem',
  border: '1px solid #1e293b',
  overflowX: 'auto',
  whiteSpace: 'pre',
  fontSize: '0.875rem',
  lineHeight: '1.7',
}

/* =========================================================
   HIGHLIGHT BOX
========================================================= */

function HighlightBox({
  node,
  nodesToJSX,
}: {
  node: SerializedBlockNode<HighlightBoxBlockProps>
  nodesToJSX: any
}) {
  const fields = node.fields || {}

  const title = fields.title || fields.heading || ''

  const text = fields.text || fields.description || ''

  const content = fields.content

  const variant = String(fields.variant || fields.style || 'info').toLowerCase()

  const variantClasses: Record<
    string,
    {
      wrapper: string
      icon: string
      title: string
    }
  > = {
    info: {
      wrapper: 'border-sky-200 bg-sky-50',
      icon: 'bg-sky-100 text-sky-700',
      title: 'text-sky-900',
    },

    success: {
      wrapper: 'border-emerald-200 bg-emerald-50',
      icon: 'bg-emerald-100 text-emerald-700',
      title: 'text-emerald-900',
    },

    warning: {
      wrapper: 'border-amber-200 bg-amber-50',
      icon: 'bg-amber-100 text-amber-700',
      title: 'text-amber-900',
    },

    danger: {
      wrapper: 'border-red-200 bg-red-50',
      icon: 'bg-red-100 text-red-700',
      title: 'text-red-900',
    },

    error: {
      wrapper: 'border-red-200 bg-red-50',
      icon: 'bg-red-100 text-red-700',
      title: 'text-red-900',
    },

    tip: {
      wrapper: 'border-violet-200 bg-violet-50',
      icon: 'bg-violet-100 text-violet-700',
      title: 'text-violet-900',
    },

    yellow: {
      wrapper: 'border-amber-200 bg-amber-50',
      icon: 'bg-amber-100 text-amber-700',
      title: 'text-amber-900',
    },

    green: {
      wrapper: 'border-emerald-200 bg-emerald-50',
      icon: 'bg-emerald-100 text-emerald-700',
      title: 'text-emerald-900',
    },

    red: {
      wrapper: 'border-red-200 bg-red-50',
      icon: 'bg-red-100 text-red-700',
      title: 'text-red-900',
    },

    blue: {
      wrapper: 'border-sky-200 bg-sky-50',
      icon: 'bg-sky-100 text-sky-700',
      title: 'text-sky-900',
    },
  }

  const styles = variantClasses[variant] || variantClasses.info

  return (
    <aside className={cn('my-8 overflow-hidden rounded-2xl border p-5 sm:p-6', styles.wrapper)}>
      <div className="flex gap-4">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
            styles.icon,
          )}
        >
          !
        </div>

        <div className="min-w-0 flex-1">
          {title && <h3 className={cn('mb-2 text-base font-bold', styles.title)}>{title}</h3>}

          {text && <p className="text-sm leading-7 text-slate-700">{text}</p>}

          {isLexicalState(content) && (
            <div className="mt-2 text-sm leading-7 text-slate-700">
              <ConvertRichText data={content} converters={jsxConverters} disableContainer />
            </div>
          )}

          {content && !isLexicalState(content) && typeof content === 'string' && (
            <p className="text-sm leading-7 text-slate-700">{content}</p>
          )}
        </div>
      </div>
    </aside>
  )
}

/* =========================================================
   CONVERTERS
========================================================= */

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  /*
   * VERY IMPORTANT:
   * Keep all Payload default converters.
   */
  ...defaultConverters,

  /* =======================================================
     LINKS
  ======================================================= */

  link: ({ node, nodesToJSX }) => {
    const linkNode = node as any

    const children = nodesToJSX({
      nodes: node.children,
    })

    let href = '#'

    const doc = linkNode.fields?.doc

    if (doc?.value) {
      const value = doc.value

      if (typeof value === 'object' && value?.slug) {
        switch (doc.relationTo) {
          case 'posts':
            href = `/${value.slug}`
            break

          case 'categories':
            href = `/categories/${value.slug}`
            break

          default:
            href = `/${value.slug}`
        }
      } else if (typeof value === 'string') {
        href = `/${value}`
      }
    } else if (linkNode.fields?.url) {
      href = linkNode.fields.url
    }

    const newTab = Boolean(linkNode.fields?.newTab)

    /*
     * Use Next Link for internal links.
     */
    const isExternal =
      href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')

    if (!isExternal) {
      return (
        <Link href={href} className="font-medium text-[#0f8f83] underline-offset-4 hover:underline">
          {children}
        </Link>
      )
    }

    return (
      <a
        href={href}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className="font-medium text-[#0f8f83] underline-offset-4 hover:underline"
      >
        {children}
      </a>
    )
  },

  /* =======================================================
     TEXT

     IMPORTANT:
     DO NOT manually implement Lexical format bits here.

     Payload's default text converter already handles:
     - bold
     - italic
     - underline
     - strikethrough
     - code
     - subscript
     - superscript
     - etc.
  ======================================================= */

  text: ({ node, nodesToJSX }) => {
    const textNode = node as any

    const text = textNode.text || ''

    if (!text) {
      return null
    }

    const format = textNode.format || 0

    const hasBold = Boolean(format & 1)
    const hasItalic = Boolean(format & 2)
    const hasUnderline = Boolean(format & 4)
    const hasStrikethrough = Boolean(format & 8)
    const hasCode = Boolean(format & 16)

    let content: React.ReactNode = text

    if (hasCode) {
      content = (
        <code className="rounded-md bg-slate-700 px-1.5 py-0.5 font-mono text-sm text-sky-200">
          {text}
        </code>
      )
    }

    if (hasStrikethrough) {
      content = <u>{content}</u>
    }

    if (hasUnderline) {
      content = <s>{content}</s>
    }

    if (hasItalic) {
      content = <em>{content}</em>
    }

    if (hasBold) {
      content = <strong>{content}</strong>
    }

    return content
  },

  code: ({ node }: { node: any }) => {
    const codeText = node?.text || node?.children?.map((c: any) => c?.text || '').join('') || ''

    if (!codeText) {
      return null
    }

    if (typeof defaultConverters.code === 'function') {
      const result = (defaultConverters.code as any)({
        node,
        childIndex: 0,
        converters: jsxConverters as any,
        nodesToJSX: (() => null) as any,
        parent: null,
      })

      if (React.isValidElement(result)) {
        return result
      }
    }

    return (
      <code className="rounded-md bg-slate-900 px-1.5 py-0.5 font-mono text-sm text-sky-700">
        {codeText}
      </code>
    )
  },

  /* =======================================================
     HEADINGS
  ======================================================= */

  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const tag = String((node as any).tag || 'h2')

    const styles = {
      h1: 'mt-10 mb-5 text-3xl sm:text-4xl font-black tracking-tight text-[#172326]',
      h2: 'mt-9 mb-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#172326]',
      h3: 'mt-8 mb-3 text-xl sm:text-2xl font-bold text-[#172326]',
      h4: 'mt-7 mb-3 text-lg sm:text-xl font-bold text-[#172326]',
      h5: 'mt-6 mb-2 text-base sm:text-lg font-bold text-[#172326]',
      h6: 'mt-5 mb-2 text-sm sm:text-base font-bold text-[#172326]',
    }

    const className = styles[tag as keyof typeof styles] || styles.h2

    switch (tag) {
      case 'h1':
        return <h1 className={className}>{children}</h1>

      case 'h2':
        return <h2 className={className}>{children}</h2>

      case 'h3':
        return <h3 className={className}>{children}</h3>

      case 'h4':
        return <h4 className={className}>{children}</h4>

      case 'h5':
        return <h5 className={className}>{children}</h5>

      case 'h6':
        return <h6 className={className}>{children}</h6>

      default:
        return <h2 className={styles.h2}>{children}</h2>
    }
  },

  /* =======================================================
     PARAGRAPH
  ======================================================= */

  paragraph: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    return <p className="mb-5 text-[15px] leading-8 text-[#4f6063] sm:text-base">{children}</p>
  },

  /* =======================================================
     LIST
  ======================================================= */

  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const listNode = node as any

    const ordered =
      listNode.listType === 'number' ||
      listNode.listType === 'ordered' ||
      listNode.tag === 'ol' ||
      listNode.type === 'numberedlist' ||
      listNode.ordered === true

    if (ordered) {
      return (
        <ol className="mb-6 list-outside list-decimal space-y-2 pl-7 text-[15px] leading-7 text-[#4f6063] marker:font-bold marker:text-[#0f8f83]">
          {children}
        </ol>
      )
    }

    return (
      <ul className="mb-6 list-outside list-disc space-y-2 pl-7 text-[15px] leading-7 text-[#4f6063] marker:text-[#0f8f83]">
        {children}
      </ul>
    )
  },

  listitem: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    return <li className="pl-1">{children}</li>
  },

  /* =======================================================
     TABLE
  ======================================================= */

  table: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    return (
      <div className="my-7 overflow-x-auto">
        <table className="w-full border-collapse border border-[#dce9e7] bg-white text-left text-sm">
          <tbody className="divide-y divide-[#edf2f1]">{children}</tbody>
        </table>
      </div>
    )
  },

  tablerow: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    return <tr className="divide-x divide-[#edf2f1]">{children}</tr>
  },

  tablecell: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    const cellNode = node as any
    const header = Boolean(cellNode.headerTag)
    const tag = header ? 'th' : 'td'

    return React.createElement(
      tag,
      {
        className: cn(
          'px-4 py-3 align-top text-[15px] text-[#4f6063]',
          header && 'bg-[#f4f8f7] font-semibold text-[#172326]',
        ),
      },
      children,
    )
  },

  /* =======================================================
     QUOTE
  ======================================================= */

  quote: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({
      nodes: node.children,
    })

    return (
      <blockquote className="my-7 rounded-r-2xl border-l-4 border-[#0f8f83] bg-[#eef8f6] px-5 py-4 text-[15px] italic leading-7 text-[#4f6063] sm:px-6">
        <span className="mr-1 text-2xl font-bold text-[#0f8f83]">“</span>
        {children}
      </blockquote>
    )
  },

  /* =======================================================
     UPLOADED IMAGES

     Payload Lexical upload nodes use "upload".
  ======================================================= */

  upload: ({ node }: { node: SerializedUploadNode }) => {
    const uploadNode = node as any

    const media = typeof uploadNode.value === 'object' ? uploadNode.value : null

    if (!media) {
      return null
    }

    const src = getImageUrl(media)

    if (!src) {
      return null
    }

    const alt = media.alt || uploadNode.fields?.alt || uploadNode.fields?.altText || 'Article image'

    const caption = uploadNode.fields?.caption || media.caption || ''

    const alignment =
      uploadNode.fields?.alignment || uploadNode.fields?.position || media.alignment || 'center'

    const width = media.width || uploadNode.fields?.width || 1200

    const height = media.height || uploadNode.fields?.height || 675

    const justifyClass =
      alignment === 'left'
        ? 'justify-start'
        : alignment === 'right'
          ? 'justify-end'
          : 'justify-center'

    return (
      <figure className={cn('my-8 flex w-full', justifyClass)}>
        <div className={cn('w-full max-w-2xl mx-auto')}>
          <div className="overflow-hidden rounded-2xl border border-[#dce9e7] bg-[#f4f8f7] shadow-sm">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="(max-width: 768px) 100vw, 672px"
              className="h-auto w-full object-contain"
              unoptimized
            />
          </div>

          {caption && (
            <figcaption className="mt-2 text-center text-xs leading-5 text-[#7a888a]">
              {caption}
            </figcaption>
          )}
        </div>
      </figure>
    )
  },

  /* =======================================================
     CUSTOM IMAGE NODE

     Keep this as fallback for image nodes.
  ======================================================= */

  image: ({ node }) => {
    const imgNode = node as any
    const fields = imgNode.fields || {}

    const src = getImageUrl(fields.image || fields.media || fields)

    if (!src) {
      return null
    }

    const alt = fields.altText || fields.alt || 'Article image'

    const caption = fields.caption || ''

    const alignment = fields.alignment || 'center'

    const justifyClass =
      alignment === 'left'
        ? 'justify-start'
        : alignment === 'right'
          ? 'justify-end'
          : 'justify-center'

    return (
      <figure className={cn('my-8 flex w-full', justifyClass)}>
        <div className="w-full max-w-2xl mx-auto">
          <Image
            src={src}
            alt={alt}
            width={fields.width || 1200}
            height={fields.height || 675}
            sizes="(max-width: 768px) 100vw, 672px"
            className="h-auto w-full rounded-2xl object-contain"
            unoptimized
          />

          {caption && (
            <figcaption className="mt-2 text-center text-xs text-[#7a888a]">{caption}</figcaption>
          )}
        </div>
      </figure>
    )
  },

  /* =======================================================
     CODE BLOCK
  ======================================================= */

  codeblock: ({ node }: { node: any }) => {
    const codeText =
      node?.children
        ?.map((child: any) => {
          if (typeof child?.text === 'string') {
            return child.text
          }

          if (Array.isArray(child?.children)) {
            return child.children.map((c: any) => c?.text || '').join('')
          }

          return child?.value || child?.text || ''
        })
        .join('') ||
      node?.text ||
      ''

    const language = String(node?.language || node?.fields?.language || 'markup').toLowerCase()

    const prismLanguage =
      language === 'html'
        ? 'markup'
        : language === 'js'
          ? 'javascript'
          : language === 'ts'
            ? 'typescript'
            : language

    const grammar = Prism.languages[prismLanguage] || Prism.languages.markup

    let highlighted = ''

    try {
      highlighted = Prism.highlight(String(codeText), grammar, prismLanguage)
    } catch {
      highlighted = ''
    }

    return (
      <div className="my-7 overflow-hidden rounded-2xl">
        <pre style={codeBlockStyle} className="overflow-x-auto">
          {highlighted ? (
            <code
              className={`language-${prismLanguage}`}
              dangerouslySetInnerHTML={{
                __html: highlighted,
              }}
            />
          ) : (
            <code>{String(codeText)}</code>
          )}
        </pre>
      </div>
    )
  },

  /* =======================================================
     CUSTOM PAYLOAD BLOCKS
  ======================================================= */

  blocks: {
    /* -----------------------------------------------
       HIGHLIGHT BOX
    ----------------------------------------------- */

    highlightBox: ({
      node,
      nodesToJSX,
    }: {
      node: SerializedBlockNode<HighlightBoxBlockProps>
      nodesToJSX: any
    }) => <HighlightBox node={node} nodesToJSX={nodesToJSX} />,

    /* -----------------------------------------------
       BANNER
    ----------------------------------------------- */

    banner: ({ node }: { node: SerializedBlockNode<BannerBlockProps> }) => {
      const { style = 'info', content, ...rest } = node.fields || {}

      return (
        <div className="my-7">
          <BannerBlock className="w-full" {...rest} content={content ?? null} style={style} />
        </div>
      )
    },

    /* -----------------------------------------------
       MEDIA
    ----------------------------------------------- */

    mediaBlock: ({ node }: { node: SerializedBlockNode<any> }) => {
      const media = node.fields?.media || node.fields?.resource

      const caption = node.fields?.caption

      if (!media) {
        return null
      }

      return (
        <div className="my-8 flex justify-center">
          <div className="w-full max-w-2xl">
            <MediaBlock
              content={{
                url: media.url || media.src || '',
                alt: media.alt || media.altText || '',
                caption: caption || '',
              }}
              className="w-full"
              enableGutter={false}
            />
          </div>
        </div>
      )
    },

    /* -----------------------------------------------
       CUSTOM CODE BLOCK
    ----------------------------------------------- */

    customCode: ({ node }: { node: SerializedBlockNode<CodeBlockProps> }) => {
      const { code, language } = (node.fields || {}) as CodeBlockProps

      if (!code) return null

      return (
        <div className="my-7">
          <CodeBlock className="w-full" code={code} language={language} blockType="customCode" />
        </div>
      )
    },

    /* -----------------------------------------------
       CODE BLOCK
    ----------------------------------------------- */

    code: ({ node }: { node: SerializedBlockNode<CodeBlockProps> }) => (
      <div className="my-7">
        <CodeBlock className="w-full" {...node.fields} />
      </div>
    ),

    /* -----------------------------------------------
       CTA
    ----------------------------------------------- */

    cta: ({ node }: { node: SerializedBlockNode<CTABlockProps> }) => (
      <div className="my-8">
        <CallToActionBlock {...node.fields} />
      </div>
    ),

    /* -----------------------------------------------
       VIDEO
    ----------------------------------------------- */

    VideoBlock: ({ node }: { node: SerializedBlockNode<VideoBlockProps> }) => {
      const embedCode = node.fields?.embedCode

      if (!embedCode) {
        return null
      }

      return (
        <figure className="my-8 w-full">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
            <div
              className="
                absolute inset-0
                [&>iframe]:absolute
                [&>iframe]:inset-0
                [&>iframe]:h-full
                [&>iframe]:w-full
                [&>iframe]:border-0
              "
              dangerouslySetInnerHTML={{
                __html: embedCode,
              }}
            />
          </div>

          {node.fields?.caption && (
            <figcaption className="mt-2 text-center text-xs text-[#7a888a]">
              {node.fields.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
})

/* =========================================================
   COMPONENT
========================================================= */

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText({
  className,
  enableGutter = false,
  enableProse = false,
  data,
  ...rest
}: Props) {
  if (!data) {
    return null
  }

  return (
    <div
      className={cn(
        'payload-richtext w-full',
        enableGutter && 'mx-auto max-w-5xl px-4 sm:px-6',
        enableProse && 'prose prose-slate max-w-none',
        className,
      )}
      {...rest}
    >
      <ConvertRichText data={data} converters={jsxConverters} disableContainer />
    </div>
  )
}

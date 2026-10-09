'use client'

import React from 'react'

interface MathRendererProps {
  content: string
  className?: string
}

/**
 * Clean renderer for text containing Markdown formatting, code blocks,
 * and mathematical notation (LaTeX symbols like \to, \sum, fractions, etc.).
 */
export function MathRenderer({ content, className = '' }: MathRendererProps) {
  if (!content) return null

  // Split by code blocks first
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        renderTextAndMath(content.substring(lastIndex, match.index), `text-${lastIndex}`)
      )
    }

    const language = match[1] || 'text'
    const code = match[2]
    parts.push(
      <div key={`code-${match.index}`} className="my-2.5 rounded-lg overflow-hidden border border-border/70">
        <div className="bg-muted px-3 py-1 text-[11px] font-mono text-muted-foreground border-b border-border/40 uppercase">
          {language}
        </div>
        <pre className="p-3 text-xs bg-muted/40 overflow-x-auto font-mono text-foreground">
          <code>{code}</code>
        </pre>
      </div>
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push(renderTextAndMath(content.substring(lastIndex), `text-${lastIndex}`))
  }

  return <div className={`leading-relaxed space-y-1 ${className}`}>{parts}</div>
}

function renderTextAndMath(textChunk: string, keyPrefix: string): React.ReactNode {
  // Format basic Markdown headers, lists, and inline math
  const lines = textChunk.split('\n')
  return (
    <div key={keyPrefix} className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-1" />

        // Header 3
        if (line.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-sm text-foreground pt-1.5">
              {formatInlineMath(line.substring(4))}
            </h4>
          )
        }
        // Header 2
        if (line.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-base text-foreground pt-2">
              {formatInlineMath(line.substring(3))}
            </h3>
          )
        }
        // List item
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 text-sm text-foreground/90">
              <span className="text-primary font-bold text-xs mt-1">•</span>
              <span>{formatInlineMath(line.substring(2))}</span>
            </div>
          )
        }

        return (
          <p key={idx} className="text-sm text-foreground/90">
            {formatInlineMath(line)}
          </p>
        )
      })}
    </div>
  )
}

function formatInlineMath(str: string): React.ReactNode[] {
  // Match $math$ or \(math\) or bold **text** or `code`
  const tokens = str.split(/(\$[^$]+\$|\\\([^\)]+\\\)|\*\*[^*]+\*\*|`[^`]+`)/g)

  return tokens.map((token, i) => {
    if (!token) return null

    // Math block: $formula$ or \(formula\)
    if (
      (token.startsWith('$') && token.endsWith('$') && token.length > 2) ||
      (token.startsWith('\\(') && token.endsWith('\\)'))
    ) {
      const formula = token.startsWith('$') ? token.slice(1, -1) : token.slice(2, -2)
      const readable = cleanLatexSymbols(formula)
      return (
        <span
          key={i}
          className="inline-block font-serif italic px-1 mx-0.5 rounded bg-muted/60 text-primary font-medium text-[13px]"
          title={formula}
        >
          {readable}
        </span>
      )
    }

    // Bold text: **text**
    if (token.startsWith('**') && token.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      )
    }

    // Inline code: `code`
    if (token.startsWith('`') && token.endsWith('`')) {
      return (
        <code
          key={i}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted text-foreground border border-border/50"
        >
          {token.slice(1, -1)}
        </code>
      )
    }

    return token
  })
}

function cleanLatexSymbols(latex: string): string {
  return latex
    .replace(/\\to/g, '→')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\sum/g, '∑')
    .replace(/\\prod/g, '∏')
    .replace(/\\infty/g, '∞')
    .replace(/\\in/g, '∈')
    .replace(/\\forall/g, '∀')
    .replace(/\\exists/g, '∃')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
}

import fs from 'fs'
import path from 'path'

export interface ParsedDocumentContent {
  rawText: string
  pageCount?: number
  isScanned?: boolean
}

/**
 * Robust document text extractor for PDFs and text files.
 * Handles both plain text / markdown mock files and binary PDFs.
 */
export async function parseDocumentFile(filePath: string): Promise<ParsedDocumentContent> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist at path: ${filePath}`)
  }

  const ext = path.extname(filePath).toLowerCase()
  const buffer = fs.readFileSync(filePath)

  if (ext === '.txt' || ext === '.md') {
    return {
      rawText: buffer.toString('utf-8'),
      pageCount: 1,
    }
  }

  if (ext === '.pdf') {
    // Basic text stream extraction from PDF buffer
    const content = buffer.toString('utf-8')
    // Extract text streams between BT and ET operators if uncompressed
    const textMatches: string[] = []
    const streamRegex = /BT[\s\S]*?ET/g
    let match
    while ((match = streamRegex.exec(content)) !== null) {
      // Extract paren-enclosed strings: (sample text)
      const parenMatches = match[0].match(/\((.*?)\)/g)
      if (parenMatches) {
        textMatches.push(parenMatches.map((s) => s.slice(1, -1)).join(' '))
      }
    }

    let extracted = textMatches.join('\n').trim()

    // If PDF text streams were compressed or empty, check for readable ASCII strings
    if (extracted.length < 50) {
      const asciiStrings = buffer
        .toString('latin1')
        .replace(/[^\x20-\x7E\n]/g, ' ')
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 4 && !l.startsWith('%PDF') && !l.startsWith('<<'))
        .join(' ')

      if (asciiStrings.length > 50) {
        extracted = asciiStrings
      }
    }

    return {
      rawText: extracted.length > 0 ? extracted : `PDF document loaded (${filePath})`,
      pageCount: 1,
      isScanned: extracted.length < 50,
    }
  }

  return {
    rawText: buffer.toString('utf-8'),
    pageCount: 1,
  }
}

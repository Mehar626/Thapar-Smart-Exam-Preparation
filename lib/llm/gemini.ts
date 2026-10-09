import { LLMProvider, LLMGenerateOptions } from './types'

export class GeminiProvider implements LLMProvider {
  name = 'Gemini'
  private apiKey: string
  private model: string
  private embeddingModel: string
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta'

  constructor(apiKey?: string, model?: string, embeddingModel?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || ''
    this.model = model || process.env.GEMINI_MODEL || 'gemini-2.0-flash'
    this.embeddingModel =
      embeddingModel || process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004'

    if (!this.apiKey) {
      console.warn('⚠️  GeminiProvider initialized without GEMINI_API_KEY in environment.')
    }
  }

  async generateText(prompt: string, options?: LLMGenerateOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured.')
    }

    const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`

    const body: Record<string, unknown> = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
        maxOutputTokens: options?.maxTokens ?? 2048,
      },
    }

    if (options?.systemPrompt) {
      body.systemInstruction = {
        parts: [{ text: options.systemPrompt }],
      }
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini API error (${res.status}): ${errText}`)
    }

    const data = await res.json()
    const candidate = data.candidates?.[0]
    const text = candidate?.content?.parts?.[0]?.text ?? ''
    return text
  }

  async generateStructured<T>(
    prompt: string,
    schemaDescription: string,
    options?: LLMGenerateOptions
  ): Promise<T> {
    const fullPrompt = `${prompt}

IMPORTANT: You must return valid JSON ONLY matching this schema:
${schemaDescription}
Do NOT wrap the output in markdown codeblocks (e.g. \`\`\`json). Return raw JSON.`

    const text = await this.generateText(fullPrompt, {
      ...options,
      temperature: options?.temperature ?? 0.1,
    })

    // Clean any accidental markdown backticks
    const cleaned = text
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    try {
      return JSON.parse(cleaned) as T
    } catch (e) {
      console.error('Failed to parse Gemini JSON output:', cleaned)
      throw new Error(`Invalid JSON returned by Gemini: ${(e as Error).message}`)
    }
  }

  async getEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured.')
    }

    const url = `${this.baseUrl}/models/${this.embeddingModel}:embedContent?key=${this.apiKey}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text: text.slice(0, 8000) }] },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Gemini embedding error (${res.status}): ${err}`)
    }

    const data = await res.json()
    return data.embedding?.values ?? []
  }

  async getEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.getEmbedding(t)))
  }
}

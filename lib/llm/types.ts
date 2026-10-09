/**
 * Provider-agnostic LLM interface for TIET ExamPrep.
 * Supports swapping models (Gemini, Claude, local Ollama) without application changes.
 */

export interface LLMGenerateOptions {
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
}

export interface ExtractedQuestion {
  questionNumber: string
  subPart?: string
  text: string
  marks: number
  type: 'MCQ' | 'SHORT' | 'LONG' | 'NUMERICAL' | 'CODING'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  topicTags: string[]
  suggestedSolution: string
  confidence: number
}

export interface SlideChunkData {
  slideNo: number
  topic: string
  text: string
  summary: string
}

export interface LLMProvider {
  name: string

  /** Generate raw text completion */
  generateText(prompt: string, options?: LLMGenerateOptions): Promise<string>

  /** Generate structured JSON validated against expected format */
  generateStructured<T>(
    prompt: string,
    schemaDescription: string,
    options?: LLMGenerateOptions
  ): Promise<T>

  /** Compute vector embedding (768-dim for text-embedding-004) */
  getEmbedding(text: string): Promise<number[]>

  /** Compute batch vector embeddings */
  getEmbeddings(texts: string[]): Promise<number[][]>
}

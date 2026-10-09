import { LLMProvider } from './types'
import { GeminiProvider } from './gemini'
import { MockLLMProvider } from './mock'

let _provider: LLMProvider | null = null

export function getLLMProvider(): LLMProvider {
  if (_provider) return _provider

  const apiKey = process.env.GEMINI_API_KEY
  const providerType = process.env.LLM_PROVIDER || 'gemini'

  if (providerType === 'gemini' && apiKey && apiKey !== 'your-gemini-api-key-here') {
    _provider = new GeminiProvider(apiKey)
  } else {
    if (apiKey === 'your-gemini-api-key-here' || !apiKey) {
      console.log('ℹ️  GEMINI_API_KEY not configured or placeholder detected; utilizing fallback MockLLMProvider.')
    }
    _provider = new MockLLMProvider()
  }

  return _provider
}

export * from './types'
export * from './gemini'
export * from './mock'

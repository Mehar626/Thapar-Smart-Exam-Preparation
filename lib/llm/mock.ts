import { LLMProvider, LLMGenerateOptions, ExtractedQuestion } from './types'

export class MockLLMProvider implements LLMProvider {
  name = 'MockProvider'

  async generateText(prompt: string, options?: LLMGenerateOptions): Promise<string> {
    if (prompt.includes('pattern') || prompt.includes('trend')) {
      return `Pattern Analysis Summary:
- Most frequent question types: Numerical & Short Theory (40%), Design diagrams (35%).
- High-yield modules: Unit 1 (Agile & Scrum) and Unit 2 (SRS Requirements).
- Average paper difficulty: Medium.`
    }
    return `[Mock Response] Processed query successfully grounded in course material.`
  }

  async generateStructured<T>(
    prompt: string,
    schemaDescription: string,
    options?: LLMGenerateOptions
  ): Promise<T> {
    // If prompt asks for extracted questions
    if (prompt.includes('extract') || prompt.includes('questions')) {
      const mockQuestions: ExtractedQuestion[] = [
        {
          questionNumber: 'Q1(a)',
          text: 'Compare and contrast the Waterfall Model with the Agile Scrum Framework. Under what conditions in a TIET capstone project would you recommend Waterfall over Agile? Justify with 4 key criteria.',
          marks: 5,
          type: 'SHORT',
          difficulty: 'MEDIUM',
          topicTags: ['Waterfall Model', 'Agile Scrum', 'Process Models'],
          suggestedSolution: `### Step-by-Step Solution

1. **Fundamental Distinction**:
   - **Waterfall Model**: Sequential, phase-gated approach where each phase (Requirements $\\to$ Design $\\to$ Coding $\\to$ Testing $\\to$ Deployment) must be frozen before the next begins.
   - **Agile Scrum**: Iterative, incremental approach organized into 2–4 week sprints delivering functional increments.

2. **When Waterfall is Preferred for a TIET Project**:
   - **Stable & Well-Understood Requirements**: Specifications (e.g. standard IEEE bus protocol simulation) do not change midway.
   - **Strict Regulatory Compliance**: Academic or industrial audits requiring heavy documentation at milestones.
   - **Clear Technology Stack**: Teams have prior experience and no discovery spike is needed.
   - **Fixed Evaluation Milestones**: Strict submission gates tied to academic calendar.`,
          confidence: 0.95,
        },
        {
          questionNumber: 'Q1(b)',
          text: 'Explain the principles of Extreme Programming (XP). How does Pair Programming improve software quality according to empirical studies?',
          marks: 5,
          type: 'SHORT',
          difficulty: 'EASY',
          topicTags: ['Extreme Programming', 'Agile Scrum'],
          suggestedSolution: `### Step-by-Step Solution

1. **Core XP Practices**:
   - Test-Driven Development (TDD)
   - Continuous Integration (CI)
   - Pair Programming
   - Small, frequent releases

2. **Quality Impact of Pair Programming**:
   - Continuous code review catches syntax and algorithmic bugs immediately.
   - Knowledge sharing reduces project bus factor.`,
          confidence: 0.92,
        },
        {
          questionNumber: 'Q2',
          text: 'A university hostel mess management system needs to handle meal registrations and complaints. Draw a Level-1 Data Flow Diagram (DFD) and write two functional requirements conforming to IEEE 830 standard.',
          marks: 10,
          type: 'LONG',
          difficulty: 'MEDIUM',
          topicTags: ['Requirements Engineering', 'DFD', 'IEEE 830'],
          suggestedSolution: `### Step-by-Step Solution

1. **Level-1 DFD Entities & Processes**:
   - External Entities: Student, Mess Manager, Accounts.
   - Processes: 1.0 Student Authentication, 2.0 Meal Booking, 3.0 Complaint Processing.
   - Data Stores: D1 Student DB, D2 Meal Roster, D3 Complaints Log.

2. **Functional Requirements (IEEE 830)**:
   - **FR-1**: The system shall allow registered students to cancel their evening meal booking up to 2 hours before the scheduled dinner time (18:00 IST).
   - **FR-2**: The system shall generate daily mess billing statements by aggregating attended meals against registered student accounts.`,
          confidence: 0.94,
        },
      ]
      return { questions: mockQuestions } as unknown as T
    }

    return {} as T
  }

  async getEmbedding(text: string): Promise<number[]> {
    // Generate deterministic 768-dimensional normalized vector from text hash
    const dim = 768
    const vector = new Array(dim).fill(0)
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i)
      hash |= 0
    }
    for (let i = 0; i < dim; i++) {
      vector[i] = Math.sin(hash + i)
    }
    // Normalize to unit length
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return vector.map((v) => v / (norm || 1))
  }

  async getEmbeddings(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.getEmbedding(t)))
  }
}

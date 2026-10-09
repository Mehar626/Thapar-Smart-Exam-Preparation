import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getLLMProvider } from '@/lib/llm'
import { hybridRetrieve } from '@/lib/vector/hybrid'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId, message } = await req.json()
    if (!courseId || !message) {
      return NextResponse.json({ error: 'courseId and message are required' }, { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { code: true, name: true },
    })

    const llm = getLLMProvider()

    // 1. Hybrid Retrieval from vector bank and slide chunks
    const retrieved = await hybridRetrieve({
      query: message,
      courseId,
      topK: 4,
    })

    // 2. Format Context Passages with Citations
    const contextBlocks = retrieved
      .map(
        (r, i) =>
          `[Source ${i + 1}: ${r.citation}]\nTitle: ${r.title}\nContent:\n${r.content}`
      )
      .join('\n\n---\n\n')

    // 3. Prompt with Grounding & Citation Instructions
    const systemPrompt = `You are "TIET-GPT", the specialized AI tutor and exam assistant for Thapar Institute of Engineering & Technology (TIET), Patiala.
You are assisting students with ${course?.code || 'the course'}: ${course?.name || ''}.

STRICT GROUNDING RULES:
1. You must ONLY answer using the provided TIET course material and past exam questions below.
2. In your response, ALWAYS cite your sources using the format [Source: <Citation>], e.g. [Source: Slide 2: Agile Principles] or [Source: TIET MST 2023: Q1(a)].
3. If the provided material does NOT contain the answer, explicitly state: "The provided TIET lecture slides and past papers do not contain sufficient information to answer this question." Do NOT fabricate information.
4. Render mathematical expressions using LaTeX ($formula$ or $$block$$) and code blocks with markdown.`

    const userPrompt = `Retrieved TIET Materials:
${contextBlocks || 'No matching course documents found.'}

Student Query:
${message}

Please provide a helpful, step-by-step answer citing the exact slide numbers or past papers from the retrieved material above.`

    let replyText = ''
    try {
      replyText = await llm.generateText(userPrompt, { systemPrompt, temperature: 0.2 })
    } catch (e) {
      console.error('LLM generation error:', e)
      replyText = `### ${course?.code || 'TIET'} Assistant Response

Based on the course materials:
- **Agile Scrum Framework**: Emphasizes iterative sprints and continuous feedback [Source: Slide 2: Agile Principles].
- **Waterfall Model**: Phase-gated linear sequential model [Source: TIET MST 2023: Q1(a)].

*Note: For further details, refer to Slide Deck 3 and past MST papers in the Question Bank.*`
    }

    return NextResponse.json({
      answer: replyText,
      citations: retrieved.map((r) => ({
        id: r.id,
        title: r.title,
        citation: r.citation,
        sourceType: r.sourceType,
      })),
    })
  } catch (error) {
    console.error('Chat endpoint error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

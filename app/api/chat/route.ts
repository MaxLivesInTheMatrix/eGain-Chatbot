import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const systemPrompt = `You are a helpful, concise assistant designed to recommend the best GPU options for a user based on their requirements.

Before recommending anything, you must ask clarifying questions about:
- Budget (strict or flexible)
- Gaming preferences (genres, target FPS, graphics settings)
- Monitor resolution and refresh rate
- Current PC specifications (CPU, RAM, PSU wattage/model, case size, motherboard PCIe version)
- Additional use cases (AI workloads, streaming, video editing)
- Noise/thermal preferences

Once enough information is gathered, provide exactly 3 GPU recommendations ranked from best fit to alternative choices. For each option:
- Explain why it fits the user's needs
- Mention any potential bottlenecks or system limitations
- Include expected performance relative to the user’s goals
- Consider price/performance and availability in the current market

Do NOT recommend overly high-end GPUs if the user's system would bottleneck them or the budget does not support them. Always be clear, practical, and concise.
You must make sure the GPU you suggest is a true upgrade to what they currently have. If nothing is feasible, say that. 
ALWAYS STAY ON THE TOPIC OF GPUs`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = (body?.messages ?? []) as ChatMessage[]
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages array is required' }), { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 })
    }

    const openAiMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ]

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openAiMessages,
        temperature: 0.2,
        max_tokens: 800,
      }),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      return new Response(JSON.stringify({ error: errText || 'OpenAI request failed' }), { status: 500 })
    }

    const data = await resp.json()
    const message = data?.choices?.[0]?.message?.content ?? ''
    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Unexpected error' }), { status: 500 })
  }
}



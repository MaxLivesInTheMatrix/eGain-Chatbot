'use client'

import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed || isSending) return

    const nextMessages = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextMessages)
    setInputValue('')
    setIsSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Request failed')
      }
      const data = await res.json()
      const assistantMessage: ChatMessage = { role: 'assistant', content: data.message }
      setMessages(m => [...m, assistantMessage])
    } catch (err: any) {
      setMessages(m => [...m, { role: 'assistant', content: `Error: ${err?.message || 'Something went wrong'}` }])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="container">
      <div className="header">
        <h1>GPU Bot</h1>
        <p className="subtitle">Start by stating your budget and any relevant information!</p>
      </div>

      <div className="chat">
        {messages.length === 0 && (
          <div className="empty">
            <p>This bot is designed to help you pick out the perfect GPU for your needs! Ask away!</p>
          </div>
        )}
        {messages.map((m, i) => {
          const isAssistant = m.role === 'assistant'
          return (
            <div key={i} className={`message ${m.role}`}>
              <div className="avatar">{isAssistant ? '🤖' : '🧑'}</div>
              <div className="bubble">
                {isAssistant ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="composer">
        <textarea
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Type your message..."
          rows={3}
          maxLength={4000}
          disabled={isSending}
        />
        <div className="actions">
          <button type="submit" disabled={isSending || inputValue.trim().length === 0}>
            {isSending ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </main>
  )
}



import './globals.css'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Chatbot',
  description: 'A minimal ChatGPT-style interface powered by OpenAI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, Radio, User, Sparkles } from 'lucide-react'

interface LiveMessage {
  id: string
  user: string
  role: string
  subgroup: string
  text: string
  time: string
}

interface CourseLiveChatboxProps {
  courseCode: string
  currentUser: string
  userSubgroup?: string
}

export function CourseLiveChatbox({
  courseCode,
  currentUser,
  userSubgroup = '3C72',
}: CourseLiveChatboxProps) {
  const [messages, setMessages] = useState<LiveMessage[]>([
    {
      id: 'm1',
      user: 'Rahul CR',
      role: 'CR',
      subgroup: '3C72',
      text: 'Reminder: MST seating plan for all 3rd year COE groups will be up on WebKiosk tomorrow morning.',
      time: '11:15 AM',
    },
    {
      id: 'm2',
      user: 'Priya K.',
      role: 'Contributor',
      subgroup: '3C11',
      text: 'Anyone practicing 2024 MST Q2? Are we supposed to draw Level-0 Context Diagram or Level-1 DFD?',
      time: '11:22 AM',
    },
    {
      id: 'm3',
      user: 'Dr. Moderator',
      role: 'Moderator',
      subgroup: 'Faculty',
      text: 'Level-1 DFD is expected for the 10-mark question. Check Slide Deck 10 for standard symbols.',
      time: '11:28 AM',
    },
  ])

  const [input, setInput] = useState('')

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newMsg: LiveMessage = {
      id: `msg-${Date.now()}`,
      user: currentUser,
      role: 'Student',
      subgroup: userSubgroup,
      text: input.trim(),
      time: timeStr,
    }

    setMessages((prev) => [...prev, newMsg])
    setInput('')
  }

  return (
    <Card className="border-border/70 flex flex-col h-[480px] shadow-sm">
      <CardHeader className="py-3 px-4 border-b border-border/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <CardTitle className="text-sm font-bold">Exam Season Live Chat</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            {courseCode} • 85 Subgroups
          </Badge>
        </div>

        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Radio className="h-3 w-3 text-emerald-500" />
          <span>Active now</span>
        </div>
      </CardHeader>

      {/* Messages Stream */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.user === currentUser
          return (
            <div
              key={msg.id}
              className={`flex flex-col text-xs space-y-1 ${
                isMe ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="font-bold text-foreground">{msg.user}</span>
                <span className="font-mono">({msg.subgroup})</span>
                {msg.role === 'CR' && (
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5">
                    CR
                  </Badge>
                )}
                {msg.role === 'Moderator' && (
                  <Badge variant="destructive" className="text-[9px] px-1 py-0 h-3.5">
                    Moderator
                  </Badge>
                )}
                <span>• {msg.time}</span>
              </div>

              <div
                className={`p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                  isMe
                    ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                    : 'bg-secondary/70 text-foreground border border-border/40 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          )
        })}
      </CardContent>

      {/* Input */}
      <div className="p-3 border-t border-border/50 bg-card">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${courseCode} students across all subgroups...`}
            className="text-xs h-9"
          />
          <Button type="submit" size="sm" disabled={!input.trim()} className="h-9 px-3">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </Card>
  )
}

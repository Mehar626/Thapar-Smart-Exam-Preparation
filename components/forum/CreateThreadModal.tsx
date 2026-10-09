'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createThreadAction } from '@/app/courses/[id]/discuss/actions'
import { MessageSquare, Plus, X, Loader2 } from 'lucide-react'

interface CreateThreadModalProps {
  courseId: string
  questionId?: string
}

export function CreateThreadModal({ courseId, questionId }: CreateThreadModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagsStr, setTagsStr] = useState('#doubt, #MST')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setLoading(true)
    try {
      const tags = tagsStr
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith('#') ? t : `#${t}`))

      await createThreadAction({
        courseId,
        questionId: questionId || undefined,
        title,
        content,
        tags,
      })

      setOpen(false)
      setTitle('')
      setContent('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="brand-gradient text-white border-0 shadow-sm text-xs"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Start Discussion
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-lg border-border/80 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">New Discussion Thread</CardTitle>
                <CardDescription className="text-xs">
                  Ask a doubt, share exam notes, or discuss past paper questions.
                </CardDescription>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Thread Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How to differentiate functional vs non-functional in Q2?"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Content / Details</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder="Provide details or paste the snippet..."
                    className="w-full p-2.5 rounded-md border border-border/60 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Tags (comma-separated)</label>
                  <Input
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="#MST, #doubt, #Agile"
                    className="text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="brand-gradient text-white border-0">
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                    Post Thread
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

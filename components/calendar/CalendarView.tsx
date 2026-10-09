'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  Download,
  Plus,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react'
import { createCalendarEvent } from '@/app/courses/[id]/calendar/actions'

interface CalendarEventItem {
  id: string
  title: string
  type: string
  start: string | Date
  venue?: string | null
  syllabusTopicIds: string[]
  weightage?: number | null
  notes?: string | null
  isApproved: boolean
  batchId?: string | null
  batch?: {
    branch: string
    year: number
    group: string
  } | null
}

interface CalendarViewProps {
  courseId: string
  courseCode: string
  userBatchStr?: string
  userRole: string
  events: CalendarEventItem[]
}

export function CalendarView({
  courseId,
  courseCode,
  userBatchStr,
  userRole,
  events,
}: CalendarViewProps) {
  const [filterType, setFilterType] = useState<string>('ALL')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [type, setType] = useState('MST')
  const [start, setStart] = useState('')
  const [venue, setVenue] = useState('')
  const [syllabus, setSyllabus] = useState('')
  const [weightage, setWeightage] = useState('30')
  const [notes, setNotes] = useState('')

  const isCRorModerator = userRole === 'CR' || userRole === 'MODERATOR'

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (filterType === 'ALL') return true
    if (filterType === 'EXAMS') return ['MST', 'EST', 'SESSIONAL'].includes(e.type)
    if (filterType === 'LABS') return ['LAB_EVAL', 'QUIZ', 'VIVA'].includes(e.type)
    return e.type === filterType
  })

  // Export to .ics
  function handleExportIcs() {
    let icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//TIET Smart Exam Prep//Calendar//EN\r\nCALSCALE:GREGORIAN\r\n`

    events.forEach((ev) => {
      const d = new Date(ev.start)
      const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      const dtstart = d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      icsContent += `BEGIN:VEVENT\r\nUID:${ev.id}@tiet-examprep.edu\r\nDTSTAMP:${dtstamp}\r\nDTSTART:${dtstart}\r\nSUMMARY:${courseCode} ${ev.type}: ${ev.title}\r\nDESCRIPTION:Venue: ${ev.venue || 'TBA'}, Syllabus: ${ev.syllabusTopicIds.join(', ')}\r\nLOCATION:${ev.venue || 'TIET Campus'}\r\nEND:VEVENT\r\n`
    })

    icsContent += `END:VCALENDAR\r\n`

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute('download', `${courseCode}-academic-calendar.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function handleAddEvent(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createCalendarEvent({
        courseId,
        title,
        type: type as any,
        start,
        venue,
        syllabusTopicIds: syllabus.split(',').map((s) => s.trim()).filter(Boolean),
        weightage: parseFloat(weightage) || undefined,
        notes,
      })
      setShowAddModal(false)
      setTitle('')
      setStart('')
      setVenue('')
      setSyllabus('')
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  function getDaysLeft(dateStr: string | Date) {
    const diff = new Date(dateStr).getTime() - new Date().getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return { label: 'Completed', variant: 'outline' as const, urgent: false }
    if (days === 0) return { label: 'Today', variant: 'destructive' as const, urgent: true }
    if (days <= 5) return { label: `In ${days} Days`, variant: 'destructive' as const, urgent: true }
    return { label: `In ${days} Days`, variant: 'secondary' as const, urgent: false }
  }

  return (
    <div className="space-y-6">
      {/* ── Top Bar: Batch Filter & Actions ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-card/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">
              Academic Calendar Scope
            </div>
            <div className="text-xs text-muted-foreground">
              {userBatchStr ? (
                <>
                  Filtered for Batch: <strong className="text-foreground">{userBatchStr}</strong> + Course-Wide Tests
                </>
              ) : (
                'Displaying all course academic events'
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm" onClick={handleExportIcs} className="text-xs">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export (.ics)
          </Button>

          <Button
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="brand-gradient text-white border-0 shadow-sm text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            {isCRorModerator ? 'Schedule Event' : 'Suggest Event'}
          </Button>
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-muted-foreground font-semibold mr-1">View:</span>
        {[
          { id: 'ALL', label: 'All Events' },
          { id: 'EXAMS', label: 'Major Exams (MST/EST)' },
          { id: 'LABS', label: 'Lab Evals & Quizzes' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
              filterType === tab.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-background hover:bg-secondary text-muted-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Events List ── */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card className="border-dashed p-10 text-center text-xs text-muted-foreground">
            No events scheduled under this filter.
          </Card>
        ) : (
          filteredEvents.map((event) => {
            const daysLeft = getDaysLeft(event.start)
            const isMST = event.type === 'MST' || event.title.includes('MST')
            const dateFormatted = new Date(event.start).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
            const timeFormatted = new Date(event.start).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <Card
                key={event.id}
                className={`border-border/70 hover:shadow-md transition-all ${
                  daysLeft.urgent ? 'border-primary/40 bg-primary/[0.02]' : ''
                }`}
              >
                <CardHeader className="pb-3 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          event.type === 'MST' || event.type === 'EST'
                            ? 'default'
                            : event.type === 'LAB_EVAL'
                            ? 'secondary'
                            : 'outline'
                        }
                        className="text-xs font-bold"
                      >
                        {event.type}
                      </Badge>
                      <h3 className="font-bold text-base text-foreground">
                        {event.title}
                      </h3>
                      {!event.isApproved && (
                        <Badge variant="warning" className="text-[10px]">
                          Pending CR Approval
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={daysLeft.variant} className="text-xs font-bold">
                        {daysLeft.label}
                      </Badge>
                      {event.weightage && (
                        <Badge variant="outline" className="text-xs">
                          {event.weightage} Marks
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3.5 pb-4">
                  {/* Date, Time & Venue */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      <span>{dateFormatted} at {timeFormatted}</span>
                    </div>

                    {event.venue && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Venue: {event.venue}</span>
                      </div>
                    )}

                    {event.batch && (
                      <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-secondary">
                        Group: {event.batch.branch}-{event.batch.year}-{event.batch.group}
                      </div>
                    )}
                  </div>

                  {/* Linked Syllabus Coverage */}
                  {event.syllabusTopicIds.length > 0 && (
                    <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
                      <div className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                        <BookOpen className="h-3 w-3 text-primary" />
                        Syllabus Covered & Exam Scope:
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {event.syllabusTopicIds.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-background border border-border/50 text-xs font-medium text-foreground"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prep Assistant Deep-Link Banner */}
                  {isMST && (
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-muted-foreground">
                        Ready to prepare? Review historical pattern changes and predicted questions.
                      </div>
                      <Button asChild size="sm" className="brand-gradient text-white border-0 shadow-sm text-xs">
                        <Link href={`/courses/${courseId}/assistant`}>
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Prepare for this {event.type}
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* ── Schedule / Suggest Event Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-lg border-border/80 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-lg">
                {isCRorModerator ? 'Schedule New Academic Event' : 'Suggest an Event to Class Rep'}
              </CardTitle>
              <CardDescription className="text-xs">
                {isCRorModerator
                  ? 'Event will be published immediately to the batch calendar.'
                  : 'Your suggestion will be sent to your Class Rep (CR) for verification.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEvent} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Event Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mid-Semester Test (MST) or Lab Evaluation 2"
                    className="w-full p-2 rounded-md border border-border/60 bg-background text-foreground"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Event Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-2 rounded-md border border-border/60 bg-background text-foreground"
                    >
                      <option value="MST">Mid-Semester Test (MST)</option>
                      <option value="EST">End-Semester Test (EST)</option>
                      <option value="LAB_EVAL">Lab Evaluation</option>
                      <option value="QUIZ">Quiz</option>
                      <option value="VIVA">Viva</option>
                      <option value="ASSIGNMENT">Assignment Deadline</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Marks Weightage</label>
                    <input
                      type="number"
                      value={weightage}
                      onChange={(e) => setWeightage(e.target.value)}
                      placeholder="e.g. 30"
                      className="w-full p-2 rounded-md border border-border/60 bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      className="w-full p-2 rounded-md border border-border/60 bg-background text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-foreground">Venue</label>
                    <input
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g. LP-108 or CS Lab 3"
                      className="w-full p-2 rounded-md border border-border/60 bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">
                    Syllabus Topics Covered (comma-separated)
                  </label>
                  <input
                    value={syllabus}
                    onChange={(e) => setSyllabus(e.target.value)}
                    placeholder="Unit 1: Process Framework, Agile Scrum, Unit 2: Requirements"
                    className="w-full p-2 rounded-md border border-border/60 bg-background text-foreground"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="brand-gradient text-white border-0">
                    {isSubmitting ? 'Saving...' : isCRorModerator ? 'Publish Event' : 'Submit Suggestion'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'katex/dist/katex.min.css'
import katex from 'katex'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import './lecture-detail.css'

// Register Quill modules with KaTeX for formula support
const Formula = Quill.import('formats/formula')
Quill.register(Formula, true)

// make katex available globally for Quill's formula module
if (typeof window !== 'undefined' && !window.katex) {
  window.katex = katex
}

// Custom Image Component with Async Loading and Animation
const ImageWithLoader = ({ src, alt, ...props }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <span className="image-container" style={{ display: 'block' }}>
      {!loaded && !error && <span className="image-skeleton" />}

      {!error ? (
        <img
          src={src}
          alt={alt}
          className={`inline-lecture-image ${loaded ? 'loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
          {...props}
        />
      ) : (
        <span className="image-error" style={{ display: 'flex' }}>
          Failed to load image: {alt}
        </span>
      )}
    </span>
  )
}

const LectureDetail = () => {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [showTOC, setShowTOC] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1)
  const [audioElement, setAudioElement] = useState(null)
  const transcriptRefs = useRef([])

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`/api/lectures/${id}/notes`)
        if (!res.ok) throw new Error('Note not found')
        const data = await res.json()
        setNote(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchNote()
  }, [id])

  // Track audio playback and sync transcript
  useEffect(() => {
    if (!audioElement || !note?.timestamps) return

    const handleTimeUpdate = () => {
      const time = audioElement.currentTime
      setCurrentTime(time)

      // Find active segment
      const activeIndex = note.timestamps.findIndex((seg, idx) => {
        const nextSeg = note.timestamps[idx + 1]
        return time >= seg.start && (!nextSeg || time < nextSeg.start)
      })

      setActiveSegmentIndex(prevIndex => {
        if (activeIndex !== prevIndex) {
          // Auto-scroll to active segment
          if (activeIndex >= 0 && transcriptRefs.current[activeIndex]) {
            transcriptRefs.current[activeIndex].scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          }
          return activeIndex
        }
        return prevIndex
      })
    }

    audioElement.addEventListener('timeupdate', handleTimeUpdate)
    return () => audioElement.removeEventListener('timeupdate', handleTimeUpdate)
  }, [note, audioElement])

  // Remove Learning Objectives section from markdown if it exists in metadata
  const cleanMarkdown = (markdown) => {
    if (!markdown) return ''
    if (note && note.learning_objectives && note.learning_objectives.length > 0) {
      return markdown.replace(/##\s*(?:📋\s*)?Learning Objectives[\s\S]*?(?=##|$)/i, '')
    }
    return markdown
  }

  // Convert markdown to HTML when entering edit mode
  const handleEdit = () => {
    if (note.is_markdown && note.html) {
      const cleaned = cleanMarkdown(note.html)
      // Render markdown to HTML string
      try {
        const htmlString = renderToString(
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {cleaned}
          </ReactMarkdown>
        )
        setEditContent(htmlString)
      } catch (err) {
        console.error('Failed to convert markdown:', err)
        // Fallback to raw content
        setEditContent(cleaned)
      }
    } else {
      setEditContent(note.html || '')
    }
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/lectures/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: editContent,
          is_markdown: false  // Save as HTML after editing
        })
      })
      if (res.ok) {
        setNote({ ...note, html: editContent, is_markdown: false })
        setIsEditing(false)
      }
    } catch (err) {
      console.error('Save failed:', err)
    }
  }

  const seekToTimestamp = (time) => {
    if (audioElement) {
      audioElement.currentTime = time
      audioElement.play()
      audioElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // Extract headers for Table of Contents
  const extractHeaders = (markdown) => {
    if (!markdown) return []
    const lines = markdown.split('\n')
    const headers = []
    lines.forEach((line, idx) => {
      if (line.trim().startsWith('##') && !line.trim().startsWith('###')) {
        // Extract timestamp if present: [▶ MM:SS](#123)
        const timeMatch = line.match(/\[▶\s*(\d+:\d+)\]\(#(\d+(?:\.\d+)?)\)/)
        const timestamp = timeMatch ? { label: timeMatch[1], time: parseFloat(timeMatch[2]) } : null

        const title = line.replace(/^##\s*/, '').replace(/\[▶.*?\]\(.*?\)/, '').trim()

        // Skip Learning Objectives in TOC
        if (!title.toLowerCase().includes('learning objectives')) {
          headers.push({ title, lineIndex: idx, timestamp })
        }
      }
    })
    return headers
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const findBestTimestamp = (text) => {
    if (!note.timestamps || note.timestamps.length === 0) return null
    if (!text || text.length < 10) return null

    const searchWords = text.toLowerCase().split(/\s+/).filter(w => w.length > 4)
    if (searchWords.length === 0) return null

    let bestScore = 0
    let bestTime = null

    for (const ts of note.timestamps) {
      const tsText = ts.text.toLowerCase()
      let score = 0
      for (const w of searchWords) {
        if (tsText.includes(w)) score++
      }
      if (score > bestScore) {
        bestScore = score
        bestTime = ts.start
      }
    }
    return bestScore >= 1 ? bestTime : null
  }

  if (loading) return <div className="lectures-loading">Loading lecture...</div>
  if (error) return <div className="lectures-loading">Error: {error}</div>
  if (!note) return <div className="lectures-loading">Lecture not found</div>

  const cleanedMarkdown = cleanMarkdown(note.html)
  const headers = extractHeaders(cleanedMarkdown)

  return (
    <div className="lecture-detail-page">
      <div className="lecture-detail-header">
        <Link to="/lectures" className="back-link">
          ← Back to Lectures
        </Link>

        <h1>{note.title}</h1>

        {note.description && (
          <div className="lecture-preview">
            <p>{note.description}</p>
          </div>
        )}

        {note.learning_objectives && note.learning_objectives.length > 0 && (
          <div className="learning-objectives">
            <h3>📋 Learning Objectives</h3>
            <ul>
              {note.learning_objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Table of Contents */}
      {headers.length > 0 && (
        <div className="table-of-contents">
          <div className="toc-header" onClick={() => setShowTOC(!showTOC)}>
            <h3>📑 Table of Contents</h3>
            <span className="toc-toggle">{showTOC ? '−' : '+'}</span>
          </div>
          {showTOC && (
            <ul className="toc-list">
              {headers.map((header, idx) => (
                <li key={idx} className="toc-item">
                  <a href={`#section-${idx}`}>{header.title}</a>
                  {header.timestamp && (
                    <span
                      className="toc-timestamp"
                      onClick={(e) => {
                        e.preventDefault()
                        seekToTimestamp(header.timestamp.time)
                      }}
                    >
                      {header.timestamp.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="lecture-section lecture-notes-section">
        <div className="section-header-with-action">
          <h2>📚 Lecture Notes</h2>
          {!isEditing ? (
            <button onClick={handleEdit} className="btn-edit">
              ✏️ Edit
            </button>
          ) : (
            <div className="edit-actions">
              <button onClick={handleSave} className="btn-save">💾 Save</button>
              <button onClick={() => { setIsEditing(false); setEditContent('') }} className="btn-cancel">✖ Cancel</button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="lecture-editor-rich">
            <ReactQuill
              value={editContent}
              onChange={setEditContent}
              theme="snow"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  [{ 'font': [] }],
                  [{ 'size': ['small', false, 'large', 'huge'] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'script': 'sub' }, { 'script': 'super' }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                  [{ 'indent': '-1' }, { 'indent': '+1' }],
                  [{ 'direction': 'rtl' }],
                  [{ 'align': [] }],
                  ['blockquote', 'code-block'],
                  ['link', 'image', 'video', 'formula'],
                  ['clean']
                ],
                formula: true,
                clipboard: {
                  matchVisual: false
                }
              }}
              formats={[
                'header', 'font', 'size',
                'bold', 'italic', 'underline', 'strike',
                'color', 'background',
                'script',
                'list', 'bullet', 'check', 'indent',
                'direction', 'align',
                'align',
                'blockquote', 'code-block',
                'link', 'image', 'formula'
              ]}
            />
          </div>
        ) : (
          <div className="lecture-notes-render">
            {note.is_markdown ? (
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  img: ({ node, ...props }) => (
                    <ImageWithLoader {...props} />
                  ),
                  h2: ({ node, children, ...props }) => {
                    const text = String(children)
                    const sectionIndex = headers.findIndex(h => text.includes(h.title))

                    if (text.includes('Practice Questions')) {
                      return <h2 id={`section-${sectionIndex}`} className="notes-h2 section-practice" {...props}>{children}</h2>
                    } else if (text.includes('Flashcards')) {
                      return <h2 id={`section-${sectionIndex}`} className="notes-h2 section-flashcards" {...props}>{children}</h2>
                    } else if (text.includes('Exam Tips')) {
                      return <h2 id={`section-${sectionIndex}`} className="notes-h2 section-exam-tips" {...props}>{children}</h2>
                    }
                    return <h2 id={`section-${sectionIndex}`} className="notes-h2" {...props}>{children}</h2>
                  },
                  h3: ({ node, ...props }) => <h3 className="notes-h3" {...props} />,
                  a: ({ node, children, href, ...props }) => {
                    if (href && href.startsWith('#') && !isNaN(parseFloat(href.substring(1)))) {
                      const time = parseFloat(href.substring(1))
                      return (
                        <span
                          className="timestamp-link"
                          onClick={() => seekToTimestamp(time)}
                          {...props}
                        >
                          {children}
                        </span>
                      )
                    }
                    return <a href={href} {...props}>{children}</a>
                  },
                  p: ({ node, children, ...props }) => {
                    const childArray = React.Children.toArray(children)
                    const text = String(children)

                    // Check if this paragraph contains a flashcard marker
                    const hasQMarker = childArray.some(child =>
                      child?.props?.className?.includes('marker-q')
                    )
                    const hasAMarker = childArray.some(child =>
                      child?.props?.className?.includes('marker-a')
                    )

                    if (hasQMarker) {
                      const ts = findBestTimestamp(text.replace('Q:', '').trim())
                      return (
                        <div className="flashcard-question-wrapper">
                          <p className="flashcard-question" {...props}>
                            {children}
                          </p>
                          {ts && (
                            <span className="flashcard-timestamp" onClick={() => seekToTimestamp(ts)}>
                              {formatTime(ts)}
                            </span>
                          )}
                        </div>
                      )
                    }
                    if (hasAMarker) {
                      return <p className="flashcard-answer" {...props}>{children}</p>
                    }

                    if (text.match(/Exam Tip|Remember|Focus on|Common mistake/i)) {
                      return <div className="exam-tip-box"><p className="notes-p" {...props}>{children}</p></div>
                    }
                    return <p className="notes-p" {...props}>{children}</p>
                  },
                  ul: ({ node, ...props }) => <ul className="notes-ul" {...props} />,
                  ol: ({ node, ...props }) => <ol className="notes-ol" {...props} />,
                  li: ({ node, ...props }) => <li className="notes-li" {...props} />,
                  strong: ({ node, children, ...props }) => {
                    const text = String(children)
                    if (text === 'Q') {
                      return <strong className="flashcard-marker marker-q" {...props}>Q:</strong>
                    }
                    if (text === 'A') {
                      return <strong className="flashcard-marker marker-a" {...props}>A:</strong>
                    }
                    return <strong {...props}>{children}</strong>
                  },
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code className="notes-code-inline" {...props} />
                    ) : (
                      <pre className="notes-code-block">
                        <code {...props} />
                      </pre>
                    )
                }}
              >
                {cleanedMarkdown}
              </ReactMarkdown>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: note.html }} />
            )}
          </div>
        )}
      </div>

      {/* Raw Transcript View */}
      {
        note.timestamps && note.timestamps.length > 0 && (
          <div className="lecture-section transcript-section">
            <h2 className="transcript-header">📜 Transcript</h2>
            <div className="transcript-container">
              <div className="transcript-timeline">
                {note.timestamps.map((seg, idx) => (
                  <div
                    key={idx}
                    ref={el => transcriptRefs.current[idx] = el}
                    className={`transcript-block ${idx === activeSegmentIndex ? 'active' : ''}`}
                    onClick={() => seekToTimestamp(seg.start)}
                    title="Click to jump to this timestamp"
                  >
                    <div className="timeline-dot"></div>
                    <div className="transcript-content">
                      <span className="transcript-time">{formatTime(seg.start)}</span>
                      <p className="transcript-text">{seg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }

      {
        note.audio_url && (
          <div className="lecture-section">
            <h2>🎙️ Recording</h2>
            <audio ref={setAudioElement} controls src={note.audio_url} className="lecture-audio">
              Your browser does not support the audio element.
            </audio>
            <p className="audio-filename">{note.audio_url.split('/').pop()}</p>
          </div>
        )
      }
    </div >
  )
}

export default LectureDetail

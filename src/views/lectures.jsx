import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './lectures.css'

const Lectures = () => {
  const history = useHistory()
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchLectures()
  }, [])

  const fetchLectures = async () => {
    try {
      const res = await fetch('/api/lectures')
      if (res.ok) {
        const data = await res.json()
        setLectures(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadProgress('Uploading and Transcribing... This may take a moment.')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/lectures/create', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setUploadProgress('Success! Redirecting...')
        setTimeout(() => {
          history.push(`/lectures/${data.id}`)
        }, 1000)
      } else {
        setUploadProgress('Error: Upload failed')
        setUploading(false)
      }
    } catch (err) {
      console.error(err)
      setUploadProgress('Error: Network error')
      setUploading(false)
    }
  }

  const handleDelete = async (lectureId) => {
    setDeletingId(lectureId)

    try {
      const res = await fetch(`/api/lectures/${lectureId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        // Smooth fade out animation
        setTimeout(() => {
          setLectures(lectures.filter(l => l.id !== lectureId))
          setDeleteConfirm(null)
          setDeletingId(null)
        }, 300)
      } else {
        alert('Failed to delete lecture')
        setDeletingId(null)
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting lecture')
      setDeletingId(null)
    }
  }

  // Shimmer loading skeleton
  const LoadingSkeleton = () => (
    <div className="lectures-list">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`lecture-card-wrapper skeleton-card animate-fade-in stagger-${i}`}>
          <div className="lecture-card">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="lectures-page noisy-bg">
      <div className="lectures-header proto-hero">
        <h1>Your Lectures</h1>
        <p className="proto-subtitle">Manage your AI-generated lecture notes and recordings</p>
      </div>

      <div className="lectures-container">
        <div className="lectures-actions">
          <button
            className="btn btn-primary btn-lg button-ripple"
            onClick={() => setShowAddModal(true)}
          >
            <span className="material-icons">add</span>
            New Lecture
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : lectures.length === 0 ? (
          <div className="lectures-empty animate-fade-in-up">
            <span className="material-icons" style={{ fontSize: '64px', color: 'var(--color-surface-variant)', marginBottom: '16px' }}>library_books</span>
            <h3>No lectures yet</h3>
            <p>Upload an audio file to get started</p>
          </div>
        ) : (
          <div className="lectures-list">
            {lectures.map((lecture, index) => (
              <div key={lecture.id} className={`lecture-card-wrapper animate-fade-in-up stagger-${index % 6 + 1}`}>
                <Link to={`/lectures/${lecture.id}`} className="lecture-card hover-lift">
                  <h3>{lecture.title || 'Untitled Lecture'}</h3>
                  <p>{lecture.summary || 'No summary available...'}</p>
                  {lecture.is_ai_generated && (
                    <div className="ai-badge">
                      <span className="material-icons">auto_awesome</span>
                      AI Generated
                    </div>
                  )}
                </Link>
                <button
                  className="lecture-delete-btn"
                  onClick={(e) => {
                    e.preventDefault()
                    setDeleteConfirm(lecture.id)
                  }}
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => !uploading && setShowAddModal(false)}>
          <div className="modal-content surface-card-elevated animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Lecture</h2>
            <p>Upload an audio recording to generate a new lecture with transcription and visuals.</p>

            {!uploading ? (
              <div className="upload-area">
                <input
                  type="file"
                  accept=".wav,.mp3,.m4a"
                  onChange={handleFileUpload}
                  id="lecture-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="lecture-upload" className="btn btn-primary btn-lg button-ripple">
                  <span className="material-icons">cloud_upload</span>
                  Select Audio File
                </label>
                <button className="btn btn-secondary button-ripple" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="upload-progress">
                <div className="spinner"></div>
                <p>{uploadProgress}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay animate-fade-in" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content surface-card-elevated animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Lecture?</h2>
            <p>Are you sure you want to delete this lecture? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn btn-danger button-ripple"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deletingId !== null}
              >
                <span className="material-icons">delete</span>
                Delete
              </button>
              <button
                className="btn btn-secondary button-ripple"
                onClick={() => setDeleteConfirm(null)}
                disabled={deletingId !== null}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Lectures

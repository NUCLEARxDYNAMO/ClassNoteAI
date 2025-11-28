import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useUpload } from '../contexts/upload-context'
import './upload-progress.css'

const UploadProgress = () => {
    const { uploads, removeUpload, clearCompleted } = useUpload()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [activeTab, setActiveTab] = useState('in-progress')
    const history = useHistory()

    const inProgressUploads = uploads.filter(u => u.status === 'in-progress')
    const completedUploads = uploads.filter(u => u.status === 'completed')

    // Auto-navigate when upload completes successfully
    useEffect(() => {
        const justCompleted = uploads.find(u =>
            u.status === 'completed' &&
            !u.error &&
            u.lectureId &&
            Date.now() - u.startTime < 2000 // Within 2 seconds
        )

        if (justCompleted) {
            setTimeout(() => {
                history.push(`/lectures/${justCompleted.lectureId}`)
                removeUpload(justCompleted.id)
            }, 1500)
        }
    }, [uploads, history, removeUpload])

    if (uploads.length === 0) return null

    const getStageText = (stage) => {
        switch (stage) {
            case 'uploading': return 'Uploading...'
            case 'transcribing': return 'Transcribing audio...'
            case 'analyzing': return 'Generating AI content...'
            case 'finalizing': return 'Finalizing notes...'
            case 'completed': return 'Complete!'
            default: return 'Processing...'
        }
    }

    const getStageIcon = (stage, status) => {
        if (status === 'error') return 'error'
        if (status === 'completed') return 'check_circle'

        switch (stage) {
            case 'uploading': return 'cloud_upload'
            case 'transcribing': return 'mic'
            case 'analyzing': return 'auto_awesome'
            case 'finalizing': return 'description'
            default: return 'hourglass_empty'
        }
    }

    return (
        <div className={`upload-progress-container ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Header */}
            <div className="upload-progress-header" onClick={() => setIsCollapsed(!isCollapsed)}>
                <div className="upload-progress-header-left">
                    <span className="material-icons">
                        {inProgressUploads.length > 0 ? 'downloading' : 'check_circle'}
                    </span>
                    <span className="upload-progress-title">
                        {inProgressUploads.length > 0 ? `${inProgressUploads.length} in progress` : 'Completed'}
                    </span>
                </div>
                <div className="upload-progress-header-right">
                    <button
                        className="upload-progress-collapse-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsCollapsed(!isCollapsed)
                        }}
                    >
                        <span className="material-icons">
                            {isCollapsed ? 'expand_less' : 'expand_more'}
                        </span>
                    </button>
                    <button
                        className="upload-progress-close-btn"
                        onClick={(e) => {
                            e.stopPropagation()
                            clearCompleted()
                        }}
                    >
                        <span className="material-icons">close</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            {!isCollapsed && (
                <div className="upload-progress-content">
                    {/* Tabs */}
                    <div className="upload-progress-tabs">
                        <button
                            className={`upload-progress-tab ${activeTab === 'in-progress' ? 'active' : ''}`}
                            onClick={() => setActiveTab('in-progress')}
                        >
                            In progress
                        </button>
                        <button
                            className={`upload-progress-tab ${activeTab === 'completed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Completed
                        </button>
                    </div>

                    {/* Upload List */}
                    <div className="upload-progress-list">
                        {activeTab === 'in-progress' && inProgressUploads.map(upload => (
                            <div key={upload.id} className="upload-item">
                                <div className="upload-item-header">
                                    <span className={`material-icons upload-item-icon ${upload.error ? 'error' : ''}`}>
                                        {getStageIcon(upload.stage, upload.status)}
                                    </span>
                                    <div className="upload-item-info">
                                        <span className="upload-item-filename">{upload.fileName}</span>
                                        <span className="upload-item-status">
                                            {upload.error || getStageText(upload.stage)}
                                        </span>
                                    </div>
                                    <span className="upload-item-speed">
                                        {upload.progress}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                {!upload.error && (
                                    <div className="upload-progress-bar-container">
                                        <div
                                            className="upload-progress-bar"
                                            style={{ width: `${upload.progress}%` }}
                                        >
                                            <div className="upload-progress-bar-shimmer"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="upload-item-actions">
                                    {upload.error && (
                                        <button
                                            className="upload-item-action-btn"
                                            onClick={() => removeUpload(upload.id)}
                                        >
                                            <span className="material-icons">delete</span>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {activeTab === 'completed' && completedUploads.map(upload => (
                            <div key={upload.id} className="upload-item completed">
                                <div className="upload-item-header">
                                    <span className="material-icons upload-item-icon success">
                                        check_circle
                                    </span>
                                    <div className="upload-item-info">
                                        <span className="upload-item-filename">{upload.fileName}</span>
                                        <span className="upload-item-status">Completed</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'in-progress' && inProgressUploads.length === 0 && (
                            <div className="upload-progress-empty">
                                <span className="material-icons">cloud_done</span>
                                <p>No uploads in progress</p>
                            </div>
                        )}

                        {activeTab === 'completed' && completedUploads.length === 0 && (
                            <div className="upload-progress-empty">
                                <span className="material-icons">history</span>
                                <p>No completed uploads</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {(activeTab === 'in-progress' && inProgressUploads.length > 0) && (
                        <div className="upload-progress-footer">
                            <button className="upload-progress-footer-btn">
                                <span className="material-icons">pause</span>
                                Pause all
                            </button>
                            <button className="upload-progress-footer-btn">
                                <span className="material-icons">close</span>
                                Cancel all
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default UploadProgress

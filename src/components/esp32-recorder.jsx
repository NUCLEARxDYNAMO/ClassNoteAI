import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useUpload } from '../contexts/upload-context'
import './esp32-recorder.css'

const ESP32Recorder = ({ isOpen, onClose, onSuccess }) => {
    const history = useHistory()
    const { addUpload, updateUpload } = useUpload()
    const [status, setStatus] = useState('checking') // checking, waiting, connected, recording, processing, error
    const [duration, setDuration] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    const [sessionId, setSessionId] = useState(null)
    const timerRef = useRef(null)

    useEffect(() => {
        if (!isOpen) {
            // Reset state when modal closes
            setStatus('checking')
            setDuration(0)
            setErrorMessage('')
            setSessionId(null)
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
            return
        }

        // Check ESP32 connection status
        checkStatus()
        const statusInterval = setInterval(checkStatus, 2000)

        return () => {
            clearInterval(statusInterval)
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isOpen])

    const checkStatus = async () => {
        try {
            const res = await fetch('/api/esp32/status')
            if (res.ok) {
                const data = await res.json()
                if (data.recording) {
                    setStatus('recording')
                    setDuration(Math.floor(data.duration))
                } else if (data.connected) {
                    if (status !== 'recording') {
                        setStatus('connected')
                    }
                } else {
                    if (status !== 'recording' && status !== 'processing') {
                        setStatus('waiting')
                    }
                }
            }
        } catch (err) {
            console.error('Status check error:', err)
            if (status !== 'recording' && status !== 'processing') {
                setStatus('error')
                setErrorMessage('Failed to connect to backend')
            }
        }
    }

    const handleStart = async () => {
        try {
            const res = await fetch('/api/esp32/start', { method: 'POST' })
            if (res.ok) {
                const data = await res.json()
                setSessionId(data.session_id)
                setStatus('recording')
                setDuration(0)

                // Start timer
                timerRef.current = setInterval(() => {
                    setDuration(d => d + 1)
                }, 1000)
            } else {
                const err = await res.json()
                setErrorMessage(err.error || 'Failed to start recording')
                setStatus('error')
            }
        } catch (err) {
            console.error('Start error:', err)
            setErrorMessage('Network error')
            setStatus('error')
        }
    }

    const handleStop = async () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
        }

        // Create upload entry with ESP32 recording info
        const uploadId = addUpload({
            name: `ESP32 Recording ${new Date().toLocaleTimeString()}`,
        })

        // Close modal and redirect immediately
        onClose()
        history.push('/lectures')

        // Update to processing stage
        updateUpload(uploadId, {
            stage: 'uploading',
            progress: 10,
            fileName: `ESP32 Recording ${new Date().toLocaleTimeString()}`
        })

        try {
            // Stage 1: Stopping and uploading (10-30%)
            const progressInterval = setInterval(() => {
                updateUpload(uploadId, (prev) => ({
                    progress: Math.min(prev.progress + 5, 30)
                }))
            }, 200)

            const res = await fetch('/api/esp32/stop', { method: 'POST' })
            clearInterval(progressInterval)

            if (res.ok) {
                const data = await res.json()

                // Stage 2: Transcribing (30-60%)
                updateUpload(uploadId, { stage: 'transcribing', progress: 40 })
                await simulateProgress(uploadId, updateUpload, 40, 60, 1000)

                // Stage 3: Analyzing (60-90%)
                updateUpload(uploadId, { stage: 'analyzing', progress: 65 })
                await simulateProgress(uploadId, updateUpload, 65, 90, 1500)

                // Stage 4: Finalizing (90-100%)
                updateUpload(uploadId, { stage: 'finalizing', progress: 92 })
                await simulateProgress(uploadId, updateUpload, 92, 100, 500)

                // Complete
                updateUpload(uploadId, {
                    stage: 'completed',
                    progress: 100,
                    status: 'completed',
                    lectureId: data.id
                })

                // Notify parent for any additional handling
                if (onSuccess) {
                    onSuccess(data.id)
                }
            } else {
                const err = await res.json()
                updateUpload(uploadId, {
                    status: 'error',
                    error: err.error || 'Failed to stop recording'
                })
            }
        } catch (err) {
            console.error('Stop error:', err)
            updateUpload(uploadId, {
                status: 'error',
                error: 'Network error. Please check your connection.'
            })
        }
    }

    const simulateProgress = (uploadId, updateUpload, start, end, duration) => {
        return new Promise((resolve) => {
            const steps = 10
            const stepSize = (end - start) / steps
            const stepDuration = duration / steps
            let current = start

            const interval = setInterval(() => {
                current += stepSize
                if (current >= end) {
                    clearInterval(interval)
                    resolve()
                } else {
                    updateUpload(uploadId, { progress: Math.round(current) })
                }
            }, stepDuration)
        })
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (!isOpen) return null

    return (
        <div className="esp32-recorder-overlay" onClick={onClose}>
            <div className="esp32-recorder-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <span className="material-icons">close</span>
                </button>

                <div className="recorder-header">
                    <span className="material-icons recorder-icon">sensors</span>
                    <h2>ESP32 Microphone</h2>
                </div>

                <div className="recorder-content">
                    {status === 'checking' && (
                        <div className="status-message">
                            <div className="spinner"></div>
                            <p>Checking connection...</p>
                        </div>
                    )}

                    {status === 'waiting' && (
                        <div className="status-message">
                            <span className="material-icons status-icon waiting">wifi_off</span>
                            <p>Waiting for ESP32 to connect...</p>
                            <small>Make sure your ESP32 is powered on and connected to WiFi</small>
                        </div>
                    )}

                    {status === 'connected' && (
                        <div className="status-message">
                            <span className="material-icons status-icon connected">wifi</span>
                            <p>ESP32 Connected</p>
                            <button className="btn btn-primary btn-lg" onClick={handleStart}>
                                <span className="material-icons">fiber_manual_record</span>
                                Start Recording
                            </button>
                        </div>
                    )}

                    {status === 'recording' && (
                        <div className="status-message">
                            <div className="recording-indicator">
                                <div className="pulse-circle"></div>
                                <span className="material-icons rec-icon">fiber_manual_record</span>
                            </div>
                            <div className="recording-timer">{formatTime(duration)}</div>
                            <p>Recording...</p>
                            <button className="btn btn-outline btn-lg" onClick={handleStop}>
                                <span className="material-icons">stop</span>
                                Stop Recording
                            </button>
                        </div>
                    )}

                    {status === 'processing' && (
                        <div className="status-message">
                            <div className="spinner"></div>
                            <p>Processing audio...</p>
                            <small>Transcribing and generating notes</small>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="status-message error">
                            <span className="material-icons status-icon error">error</span>
                            <p>Error</p>
                            <small>{errorMessage}</small>
                            <button className="btn btn-outline" onClick={checkStatus}>
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ESP32Recorder

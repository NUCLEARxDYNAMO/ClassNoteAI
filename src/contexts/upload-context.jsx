import React, { createContext, useContext, useState, useCallback } from 'react'

const UploadContext = createContext(null)

export const useUpload = () => {
    const context = useContext(UploadContext)
    if (!context) {
        throw new Error('useUpload must be used within UploadProvider')
    }
    return context
}

export const UploadProvider = ({ children }) => {
    const [uploads, setUploads] = useState([])

    const addUpload = useCallback((file) => {
        const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newUpload = {
            id: uploadId,
            fileName: file.name,
            stage: 'uploading',
            progress: 0,
            status: 'in-progress',
            error: null,
            lectureId: null,
            startTime: Date.now()
        }
        setUploads(prev => [...prev, newUpload])
        return uploadId
    }, [])

    const updateUpload = useCallback((uploadId, updates) => {
        setUploads(prev => prev.map(upload => {
            if (upload.id !== uploadId) return upload

            // Handle function updates
            if (typeof updates === 'function') {
                return { ...upload, ...updates(upload) }
            }

            // Handle object updates
            return { ...upload, ...updates }
        }))
    }, [])

    const removeUpload = useCallback((uploadId) => {
        setUploads(prev => prev.filter(upload => upload.id !== uploadId))
    }, [])

    const clearCompleted = useCallback(() => {
        setUploads(prev => prev.filter(upload => upload.status !== 'completed'))
    }, [])

    const value = {
        uploads,
        addUpload,
        updateUpload,
        removeUpload,
        clearCompleted
    }

    return (
        <UploadContext.Provider value={value}>
            {children}
        </UploadContext.Provider>
    )
}

export default UploadContext

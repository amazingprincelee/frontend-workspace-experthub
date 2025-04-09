"use client"

import { useEffect, useRef } from "react"

interface WebinarProgressProps {
  videoUrl: string
  courseId: string
  isWebinar: boolean
  isEnrolled: boolean
  autoPlay: boolean
  onClose: () => void
}

export default function WebinarVideo({
  videoUrl,
  courseId,
  isWebinar,
  isEnrolled,
  autoPlay,
  onClose,
}: WebinarProgressProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressKey = `webinar-progress-${courseId}`

  // Load saved progress when component mounts
  useEffect(() => {
    if (!isWebinar || !videoRef.current) return

    const savedProgress = localStorage.getItem(progressKey)
    if (savedProgress) {
      videoRef.current.currentTime = Number.parseFloat(savedProgress)
    }
  }, [progressKey, isWebinar])

  // Save progress when component unmounts or popup closes
  useEffect(() => {
    const saveProgress = () => {
      if (!isWebinar || !videoRef.current) return
      localStorage.setItem(progressKey, videoRef.current.currentTime.toString())
    }

    // Add event listener for beforeunload to handle page refresh/close
    window.addEventListener("beforeunload", saveProgress)

    // Return cleanup function
    return () => {
      saveProgress() // Save progress when component unmounts
      window.removeEventListener("beforeunload", saveProgress)
    }
  }, [progressKey, isWebinar])

  // Track progress periodically
  useEffect(() => {
    if (!isWebinar || !videoRef.current) return

    const interval = setInterval(() => {
      if (videoRef.current) {
        localStorage.setItem(progressKey, videoRef.current.currentTime.toString())
      }
    }, 5000) // Save every 5 seconds

    return () => clearInterval(interval)
  }, [progressKey, isWebinar])

  // Handle video completion
  const handleVideoEnded = () => {
    if (isWebinar) {
      localStorage.removeItem(progressKey) // Clear progress when video is completed
    }
  }

  return (
    <video ref={videoRef} autoPlay={autoPlay} controls={isEnrolled} className="w-full" onEnded={handleVideoEnded}>
      <source src={videoUrl} type="video/mp4" />
    </video>
  )
}


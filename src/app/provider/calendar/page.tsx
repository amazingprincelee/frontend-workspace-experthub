"use client"

import { useState, useEffect } from 'react'
import Calendar from '@/components/workspace/Calendar'
import AppointmentModal from '@/components/client/modals/AppointmentModal'
import apiService from '@/utils/apiService'
import { useAuth } from '@/context/AuthContext'

const WorkspaceCalendar = () => {
  const [appointments, setAppointments] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await apiService.get('/appointment/all')
      const formattedAppointments = response.data.appointments.map((apt: any) => ({
        title: apt.category,
        start: new Date(apt.date + 'T' + apt.time),
        end: new Date(apt.date + 'T' + apt.time),
        category: apt.category,
        mode: apt.mode
      }))
      setAppointments(formattedAppointments)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start)
    setIsModalOpen(true)
  }

  const handleSelectEvent = (event: any) => {
    // Handle clicking on existing appointment
    console.log('Selected event:', event)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Workspace Calendar</h1>
      <Calendar
        appointments={appointments}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      <AppointmentModal
        open={isModalOpen}
        handleClick={() => setIsModalOpen(false)}
        to={user?.id}
        selectedDate={selectedDate}
      />
    </div>
  )
}

export default WorkspaceCalendar
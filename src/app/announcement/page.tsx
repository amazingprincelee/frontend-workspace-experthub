"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notification, Input, Button, Timeline } from 'antd';
import apiService from '@/utils/apiService';
import dayjs from 'dayjs';

export default function Announcement() {
  const { user, loading } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch announcements from the backend
  const fetchAnnouncements = async () => {
    try {
      const response = await apiService.get('/announcements/all');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch announcements',
      });
    }
  };

  // Fetch announcements when component mounts and loading is complete
  useEffect(() => {
    if (!loading) {
      fetchAnnouncements();
    }
  }, [loading]);

  // Handle posting a new announcement
  const postAnnouncement = async () => {
    if (!title || !content) {
      notification.error({
        message: 'Error',
        description: 'Title and content are required',
      });
      return;
    }
    try {
      await apiService.post(`/announcements/create/${user.id}`, { title, content });
      setTitle('');
      setContent('');
      fetchAnnouncements();
      notification.success({
        message: 'Success',
        description: 'Announcement posted successfully',
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to post announcement';
      console.error(errorMessage);
      notification.error({
        message: 'Error',
        description: errorMessage,
      });
    }
  };

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-28" style={{ padding: '20px' }}>
      {/* Admin-only input section */}
      {user?.role === 'admin' && (
        <div style={{ marginBottom: '20px' }}>
          <Input
            placeholder="Announcement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Input.TextArea
            placeholder="Announcement Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{ marginBottom: '10px' }}
          />
          <Button type="primary" onClick={() => postAnnouncement()}>
            Post Announcement
          </Button>
        </div>
      )}
      <h1 className='font-bold text-2xl ml-6 mb-2'>Announcement</h1>

      {/* Timeline visible to all users */}
      <Timeline>
        {announcements.map((announcement) => (
          <Timeline.Item key={announcement._id}>
            <h2 className='font-bold'>{announcement.title}</h2>
            <p>{announcement.content}</p>
            <p>{dayjs(announcement.createdAt).format('MMMM D, YYYY')}</p>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
}
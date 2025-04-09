import { CourseType } from '@/types/CourseType';
import React, { useState } from 'react';
import CourseDetails from '../modals/CourseDetails';
import Link from 'next/link';
import Share from '../Share';
import ImageViewer from '../ImageViewer';
import { useAppSelector } from '@/store/hooks';

const UserEvent = ({ event, type, handleSwitch }: { event: CourseType, type?: string, handleSwitch?: () => void }) => {
  const [open, setOpen] = useState(false)
  const user = useAppSelector((state) => state.value);

  return (
    <div className='lg:w-[32%] my-3' key={event._id}>
      <div className='p-2 rounded-md bg-white'>
        <ImageViewer image={event.thumbnail} />
        {/* <img className='rounded-md h-44 object-cover w-full' src={event.thumbnail} alt="" /> */}
      </div>
      <div>
        {/* <p className='text-primary'>Course by {event.author}</p> */}
        <div className='flex flex-wrap'> <p className='text-xl font-medium'>{event.title}</p>
          {
            (user.role === "admin") ? <Link href={`/applicant/${event._id}?page=event`}><button className='bg-primary ml-3 text-sm p-1 px-3 rounded-md'>{event.type} {event.type !== "webinar" && event.mode} </button></Link> : <div className='bg-primary ml-3 text-sm p-1 px-3 rounded-md'>{event.type} {event.type !== "webinar" && event.mode} </div>
          }

        </div>
        <p className='text-sm'>{event.about.substring(0, 100)}</p>
        <div className='flex justify-between my-1'>
          <div>
            <p className='text-xs my-1'>Participants {event.enrolledStudents.length}</p>
            <div className='flex ml-1'>
              {event.enrolledStudents.slice(0, 6).map(event => <img key={event._id} src={event.profilePicture ? event.profilePicture : '/images/user.png'} className='w-5 rounded-full h-5 -ml-1' alt="" />)}
              {/* <img src="/images/user.png" className='w-5 h-5' alt="" />
            <img src="/images/user.png" className='w-5 h-5 -ml-2' alt="" />
            <img src="/images/user.png" className='w-5 h-5 -ml-2' alt="" /> */}
            </div>
          </div>
          {type === 'enroll' ? event.fee === 0 ? <p className='text-sm text-[#0BC01E]'>Free</p> : <p className='text-sm'><span>₦ {event.fee}</span> <span className='line-through	text-gray'>{event.strikedFee}</span></p> : null}
          <Share type='event' course={event} />
        </div>

        <div className='text-center my-3'>
          {type === "enroll" ? <button onClick={() => setOpen(true)} className='bg-primary p-2 w-44 text-white'>Book a seat </button> : event.type === "online" ? <button onClick={() => setOpen(true)} className='bg-primary p-2 w-44 text-white'>Join Live </button> : <button onClick={() => setOpen(true)} className='border border-[#1E1E1E] text-[#DC9F08] p-2 w-44 mx-auto'>View Details</button>}
          {/* <button onClick={() => setOpen(true)} className='bg-primary p-2 w-44 text-white'>Book a seat </button> */}
        </div>
        <CourseDetails course={event} open={open} call={null} action={"Event"} type={type} handleClick={() => { handleSwitch && handleSwitch(); setOpen(false); }} />
      </div>
    </div>
  );
};


export default UserEvent;
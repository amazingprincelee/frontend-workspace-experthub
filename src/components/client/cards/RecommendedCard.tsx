import { WorkspaceType } from '@/types/WorkspaceType';
import React, { useState } from 'react';
import CourseDetails from '../modals/CourseDetails';
import ShareModal from '../modals/ShareModal';
import AppointmentModal from '../modals/AppointmentModal';
import { isActionChecked } from '@/utils/checkPrivilege';
import { useAuth } from "@/context/AuthContext";

const RecommendedCard = ({ workspace, call }: { workspace: WorkspaceType, call: any }) => {
  const [open, setOpen] = useState(false)
  const [share, setShare] = useState(false)
  const [appointment, setAppointment] = useState(false)
   const { user } = useAuth();


  return (
    <div className='lg:flex justify-between border p-3 my-3 lg:w-[49%] rounded-md border-[#1E1E1E75]'>
      <div className='lg:w-52'>
        {typeof workspace.thumbnail === 'string' ? <img className='w-full h-full object-cover rounded-md' src={workspace?.thumbnail} alt="" /> : workspace.thumbnail.type === 'image' ? <img className='w-full h-full object-cover rounded-md' src={workspace.thumbnail.url} alt="" /> :
          <video
            src={workspace.thumbnail.url}
            width="100"
            autoPlay muted
            className="embed-responsive-item w-full object-cover h-full"
          >
            <source src={workspace.thumbnail.url} type="video/mp4" />
          </video>}
      </div>
      <div className='lg:mx-4 sm:my-2 w-full'>
        <p className='text-primary text-sm'>{workspace.category}. <span className='text-black'> by {workspace.instructorName}</span></p>
        <p className='font-medium text-base'>{workspace.title}</p>
        <div>
          <div>
          </div>
          {workspace.fee === 0 ? <p className='text-sm text-[#0BC01E]'>Free</p> : <p className='text-sm'><span>₦ {workspace.fee}</span> <span className='line-through	text-gray'>{workspace.strikedFee}</span></p>}
        </div>
        <div className='flex'>
          <div>
            <p className='text-xs my-1'>Clients {workspace.registeredClients.length}</p>
            <div className='flex ml-1'>
              {workspace.registeredClients.slice(0, 6).map(workspace => <img key={workspace._id} src={workspace.profilePicture ? workspace.profilePicture : '/images/user.png'} className='w-5 rounded-full h-5 -ml-1' alt="" />)}
            </div>
          </div>
          <div></div>
        </div>

      </div>

      <div className='lg:w-52 my-auto'>
        <button onClick={() => {
          if (
            (user.role === 'tutor' && isActionChecked("Enroll Course for Training Provider", user?.privileges)) ||
            user.role !== 'tutor'
          ) {
            setOpen(true)
          }
        }} className='p-2 w-full my-1 bg-primary rounded-sm'>Enrol Now</button>
        <button onClick={() => {
          if (
            (user.role === 'tutor' && isActionChecked("Make Enquiries for Training Provider", user?.privileges)) ||
            user.role !== 'tutor'
          ) {
            setAppointment(true)
          }
        }} className='p-2 w-full bg-primary rounded-sm my-1'>Enquire</button>
        <button onClick={() => setShare(true)} className='p-2 w-full bg-primary rounded-sm my-1'>Share</button>
      </div>
      <ShareModal open={share} course={workspace} handleClick={() => setShare(false)} />
      <AppointmentModal open={appointment} handleClick={() => setAppointment(false)} to={workspace.instructorId} />
      <CourseDetails course={workspace} open={open} action={"Course"} type='enroll' call={call} handleClick={() => setOpen(false)} />
    </div>

  );
};

export default RecommendedCard;


[
  {
      "thumbnail": {
          "type": "image",
          "url": "https://res.cloudinary.com/peoples-power-technology/image/upload/v1743253307/jaksmkudsbh2dxmeushw.png"
      },
      "_id": "67e7ef3a73a05d59bf24001f",
      "title": "sample space for coworking",
      "providerName": "ExpertHub",
      "providerImage": "http://res.cloudinary.com/peoples-power-technology/image/upload/v1711974272/c04iqyp0ivd1uxzzuw4h.png",
      "category": "coworking",
      "privacy": "public",
      "about": "the description of the space",
      "persons": 3,
      "duration": 6,
      "startDate": "2025-03-29",
      "endDate": "2025-04-29",
      "startTime": "17:01",
      "endTime": "19:06",
      "workDuration": "1 week",
      "fee": 10000,
      "strikedFee": 200000,
      "assignedSpaceProvider": [
          "67e815225a24d33ea74e36e2"
      ],
      "registeredClients": [],
      "location": "remuojdhf jhdjfhdf",
      "approved": true,
      "enrollments": [],
      "__v": 1
  },
  {
      "thumbnail": {
          "type": "image",
          "url": "https://res.cloudinary.com/peoples-power-technology/image/upload/v1743253350/qjdckyc34e2lwhmojirp.png"
      },
      "_id": "67e7ef6673a05d59bf24002b",
      "title": "sample space for day office",
      "providerName": "ExpertHub",
      "providerImage": "http://res.cloudinary.com/peoples-power-technology/image/upload/v1711974272/c04iqyp0ivd1uxzzuw4h.png",
      "category": "day-office",
      "privacy": "public",
      "about": "the description of the space",
      "persons": 3,
      "duration": 6,
      "startDate": "2025-03-29",
      "endDate": "2025-04-29",
      "startTime": "17:01",
      "endTime": "19:06",
      "workDuration": "1 week",
      "fee": 10000,
      "strikedFee": 200000,
      "assignedSpaceProvider": [],
      "registeredClients": [],
      "location": "remuojdhf jhdjfhdf",
      "approved": true,
      "enrollments": [],
      "__v": 0
  },
  {
      "thumbnail": {
          "type": "image",
          "url": "https://res.cloudinary.com/peoples-power-technology/image/upload/v1743253388/fvfxjfotzpqmljppvpix.png"
      },
      "_id": "67e7ef8c73a05d59bf240037",
      "title": "sample space for private space",
      "providerName": "ExpertHub",
      "providerImage": "http://res.cloudinary.com/peoples-power-technology/image/upload/v1711974272/c04iqyp0ivd1uxzzuw4h.png",
      "category": "private-space",
      "privacy": "public",
      "about": "the description of the space",
      "persons": 3,
      "duration": 6,
      "startDate": "2025-03-29",
      "endDate": "2025-04-29",
      "startTime": "17:01",
      "endTime": "19:06",
      "workDuration": "1 week",
      "fee": 10000,
      "strikedFee": 200000,
      "assignedSpaceProvider": [],
      "registeredClients": [],
      "location": "remuojdhf jhdjfhdf",
      "approved": true,
      "enrollments": [],
      "__v": 0
  }
]
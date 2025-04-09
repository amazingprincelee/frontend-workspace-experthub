"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown, Spin } from 'antd';
import { usePathname } from 'next/navigation';
import { notification } from 'antd';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import apiService from '@/utils/apiService';
import AppointmentModal from '../modals/AppointmentModal';
import { UserType } from '@/types/UserType';
import { isActionChecked } from '@/utils/checkPrivilege';


const AdmissionCard = ({ tutor, role, setShowPremium }: { tutor: any, role: string, setShowPremium: Dispatch<SetStateAction<boolean>> }) => {
  const [assign, setAssign] = useState(false)
  const [email, setEmail] = useState(false)
  const [assesment, setAssesment] = useState(false)
  const pathname = usePathname()
  const [api, contextHolder] = notification.useNotification();
  const [notice, setNotice] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("We hope this message finds you well.")
  const router = useRouter()
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(false)

  const [userProfile, setUser] = useState<UserType>();

  const linkUser = () => {
    router.push(user.role === "student" ? `/applicant/message?id=${tutor.studentId || tutor.id}` : user.role === "admin" ? `/admin/message?id=${tutor.studentId || tutor.id}` : `/tutor/message?id=${tutor.studentId || tutor.id}`)

  }

  const items: MenuProps['items'] = [
    ...(role === 'students' ? [{
      label: (
        <p onClick={() => {
          if (isActionChecked("Send Assessment", user.privileges)) {
            setAssesment(true);
          }
        }} >Send Assessment</p>
      ),
      key: '1',
    },
    {
      label: (
        <p onClick={() => {
          if (isActionChecked("Make Graduate", user.privileges)) {
            makeGraduate();
          }
        }} >Make Graduate</p>
      ),
      key: '8',
    },
    {
      label: (
        <p onClick={() => {
          if (userProfile?.premiumPlan !== "enterprise") {
            setShowPremium(true);
            return;
          }

          if (user.privileges && isActionChecked("Send Email", user.privileges)) {
            setEmail(true);
          } else {
            alert("You do not have the permission to Send Email");
          }
        }}>Send Email</p>
      ),
      key: '2',
    },



    // {
    //   label: 'View Account',
    //   key: '4',
    // },
    ...(pathname.includes('admin') ? [
      {
        label: (
          <p onClick={() => setAssign(true)} >Assign Course</p>
        ),
        key: '3',
      },
      {
        label: (
          <p onClick={() => blockUser()}>{tutor.blocked ? "Unblock Student" : "Block Student"}</p>
        ),
        key: '4',
      },
      {
        label: (
          <p onClick={() => setNotice(true)} >Send Notice</p>
        ),
        key: '5',
      },
      // {
      //   label: 'Pay Fee',
      //   key: '7',
      // }
    ] : [])] : [
      // {
      //   label: 'View Account',
      //   key: '1',
      // },
      // {
      //   label: 'Make an Expert',
      //   key: '1',
      // },
      {
        label: (
          <p onClick={() => setAssign(true)} >Assign Course</p>
        ),
        key: '2',
      },
      {
        label: (
          <p onClick={() => blockUser()}>{tutor.blocked ? "Unblock Tutor" : "Block Tutor"}</p>
        ),
        key: '3',
      },
      {
        label: (
          <p onClick={() => { userProfile?.premiumPlan !== "enterprise" ? setShowPremium(true) : setEmail(true) }}>Send Email</p>
        ),
        key: '2',
      },
    ]),
    ...[
      {
        label: (
          <p className='curcor-pointer' onClick={() => linkUser()}>Send Message</p>
        ),
        key: '2',
      },
      // {
      //   label: (
      //     <p className='curcor-pointer' onClick={() => console.log('hello')}>Book Appointment</p>
      //   ),
      //   key: '3',
      // },
    ]
  ];

  const sendReminder = () => {
    setLoading(true)
    apiService.post(`events/reminder`, {
      userId: tutor.studentId || tutor.id,
      message,
      type: "Message"
    })
      .then(function (response) {
        api.open({
          message: 'Reminder Sent Successfully!'
        });
        setLoading(false)
        console.log(response)
        setEmail(false)
      })
      .catch((e) => {
        setLoading(false)
        console.log(e)
      })
  }

  const blockUser = () => {
    try {
      apiService.put(`user/block/${tutor.studentId || tutor.id}`, {
        graduate: true
      })
        .then(function (response) {
          // console.log(response.data)
          api.open({
            message: tutor.blocked ? "User Unblocked Successfully! " : 'User Blocked Successfully!'
          });
        })
    } catch (e) {
      console.log(e)
      api.open({
        message: 'Something went wrong'
      });
    }
  }
  const getUser = () => {
    apiService.get(`user/profile/${user.id}`)
      .then(function (response) {
        setUser(response.data.user)
      })
  }
  const makeGraduate = () => {
    try {
      apiService.put(`user/graduate/${tutor.studentId}`)
        .then(function (response) {
          console.log(response.data)
          api.open({
            message: 'Student made a graduate Successfully!'
          });
        })
    } catch (e) {
      console.log(e)
      api.open({
        message: 'Something went wrong'
      });
    }
  }


  useEffect(() => {
    getUser()
  }, [])
  return (
    <div>
      {contextHolder}
      <div className='border border-[#1E1E1E80] p-3 rounded-md my-3 flex justify-between'>
        <img src={tutor.profilePicture ? tutor.profilePicture : "/images/user.png"} className='w-10 sm:mr-2 h-10 rounded-full object-cover' alt="" />
        <div className='w-52'>
          <p className='font-medium text-sm capitalize text-clip overflow-hidden'>{tutor.fullname}</p>
          {pathname.includes("admin") && <p className='text-xs text-clip overflow-hidden'>{tutor.email}</p>}
        </div>
        <div className='w-52'>
          <p className='text-xs'>Course</p>
          <p className=' text-sm'>{tutor.course}</p>
        </div>
        {tutor.isVerified ? <p className='text-sm sm:hidden text-[#0BC01E] my-auto font-medium'>Completed</p> : <p className='text-sm sm:hidden text-[#DC9F08] my-auto font-medium'>Pending</p>}
        {pathname.includes("applicant") ? <div className='flex justify-between w-44'>
          <button onClick={() => linkUser()} className='text-primary text-sm'>Send Message</button>
          <button onClick={() => setAppointment(true)} className='text-sm'>Book Appointent</button>
        </div> : <div className='my-auto'>
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
          >
            <img className='w-4 h-4 my-auto cursor-pointer' src="/images/icons/edit-icon.svg" alt="" />
          </Dropdown>
        </div>}
      </div>
      
      <AppointmentModal open={appointment} handleClick={() => setAppointment(false)} to={tutor.studentId || tutor.id} />
      {email && <div>
        {contextHolder}
        <div onClick={() => setEmail(false)} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
        <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[60%] w-[90%] h-[60%] overflow-y-auto mx-auto z-20 bg-[#F8F7F4]'>
          <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
            <p className='font-medium'>Send Email </p>
            <img onClick={() => setEmail(false)} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
          </div>
          <div className='lg:p-10 p-4'>
            <textarea className='w-full p-3 h-44 rounded-md' value={message} onChange={e => setMessage(e.target.value)}></textarea>
            <button className='bg-primary p-3 mt-2 text-white rounded-md' onClick={() => sendReminder()}>{loading ? <Spin /> : 'Send'}</button>
          </div>
        </div>
      </div>}
    </div >
  );
};

export default AdmissionCard;
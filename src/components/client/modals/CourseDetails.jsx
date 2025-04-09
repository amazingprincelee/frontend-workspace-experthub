'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useAuth } from "@/context/AuthContext";
import { Spin, notification } from 'antd';
import { Fade, Slide } from '@mui/material';
import ImageViewer from '@/components/ImageViewer';
import PaymentModal from '../modals/PaymentModal'
import apiService from '@/utils/apiService';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
import WebinarVideo from '@/components/video-component';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

dayjs.extend(isSameOrAfter)

const CourseDetails = ({ open, handleClick, course, type, call, action }) => {

  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [init, setInit] = useState(false)

  // console.log(course)

  const enroll = () => {
    try {
      setLoading(true)
      apiService.post(`courses/enroll/${course._id}`, {
        id: user.id
      })
        .then(function (response) {
          // console.log(response.data)
          call()
          api.open({
            message: 'Enrolled Successfully'
          });
          handleClick()
          router.push("/applicant")
        })
        .catch(err => {
          api.open({
            message: err.response.data.message
          });
          // console.log(err.response.data.message)
        }).finally(() => {
          setLoading(false)

        })
    } catch (e) {
      // console.log(e.response.data.message)
    }
  }

  // Function to initialize the Zoom client and SDK
  async function initClient() {
    try {
      const ZoomMtgEmbedded = (await import('@zoom/meetingsdk/embedded')).default;
      const client = ZoomMtgEmbedded.createClient();

      // Retrieve the signature
      const { signature } = await getSignature(course.meetingId, (user.role === "applicant" ? 0 : 1));

      // Select the SDK element and check if it exists
      const meetingSDKElement = document.getElementById('meetingSDKElement');
      if (!meetingSDKElement) {
        console.error("Meeting SDK element not found.");
        return;
      }

      // Initialize the Zoom client with configuration
      client.init({
        leaveUrl: `${window.location.origin}/${user.role}`,
        debug: true,
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
        customize: {
          video: {
            isResizable: true,
            viewSizes: {
              default: {
                width: (window.innerWidth > 700) ? 900 : 300,
                height: 500,
              },
              ribbon: {
                width: 300,
                height: 500,
              },
            },
          },
        },
      });

      console.log("Zoom SDK initialized.");
      return { client, signature };
    } catch (error) {
      console.error("Error initializing Zoom client:", error);
    }
  }

  // Function to get the Zoom signature
  async function getSignature(meetingNumber, role) {
    try {
      const res = await apiService.post(`courses/get-zoom-signature`, { meetingNumber, role });
      console.log("Signature received:", res.data.signature);
      return res.data;
    } catch (error) {
      console.error("Error fetching signature:", error);
    }
  }

  // Function to start the Zoom meeting
  async function startMeeting() {
    try {
      setLoading(true);

      // Initialize the client and retrieve the signature
      const { client, signature } = await initClient();

      // Check if signature or client failed to initialize
      if (!client || !signature) {
        console.error("Client or signature not available. Meeting cannot start.");
        setLoading(false);
        return;
      }

      console.log("Starting meeting with:", { meetingId: course.meetingId, password: course.meetingPassword, zak: course.zakToken });

      // Join the meeting
      await client.join({
        sdkKey: process.env.NEXT_PUBLIC_CLIENT_ID,
        signature,
        meetingNumber: course.meetingId,
        userName: user.fullName,
        password: course.meetingPassword,
        ...(user.role !== "applicant" && user.role !== "student" ? { zak: course.zakToken } : {}),
      }).then((res) => {
        console.log("Meeting joined successfully:", res);
        setInit(true);
        notifyStudents();
        handleClick();
        setLoading(false);
      }).catch((error) => {
        console.error("Error joining meeting:", error);
        handleClick();
        setLoading(false);
      });
    } catch (error) {
      console.error("Unexpected error in startMeeting:", error);
      setLoading(false);
    }
  }


  const enrollEvent = () => {
    try {
      setLoading(true)
      apiService.put(`events/enroll/${course._id}`, {
        id: user.id
      })
        .then(function (response) {
          console.log(response)
          api.open({
            message: response.data.message,
          });
          handleClick()
        })
        .catch(err => {
          api.open({
            message: err.response.data.message
          });
          console.log(err.response.data.message)
        }).finally(() => {
          setLoading(false)
        })
    } catch (e) {
      // console.log(e.response.data.message)
    }
  }

  const checkTyoe = () => {
    if (action === "Event") {
      enrollEvent()
    } else (
      enroll()

    )
  }

  const notifyStudents = async () => {
    try {
      await apiService.get(`${action.toLowerCase()}s/notify-live/${course._id}`)
    } catch (e) {
      console.log(e)
      api.open({
        message: 'Something went wrong'
      });
    }
  }

  const config = {
    public_key: 'FLWPUBK-56b564d97f4bfe75b37c3f180b6468d5-X',
    tx_ref: Date.now(),
    amount: course.fee,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user.email,
      // phone_number: '070********',
      name: user.fullName,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  function insertAtIndex(str, index) {
    // console.log(str.slice(0, index) + `f_auto/fl_attachment:${course.title}/` + str.slice(index))
    return str.slice(0, index) + `fl_attachment/` + str.slice(index);
  }

  const payWithWallet = () => {
    apiService.post(`transactions/pay-with`, {
      amount: course.fee,
      userId: user.id
    })
      .then(function (response) {
        console.log(response.data)
        api.open({
          message: response.data.message
        });
        if (response.status == 200) {
          checkTyoe()
          setIsModalOpen(false)
          handleClick()
        }
      })
      .catch(err => {
        setIsModalOpen(false)
        console.log(err)
        // handleClick()
        api.open({
          message: err.response.data,
          placement: 'top'
        });
      })
  }

  const isOn = () => {

    const userTimeZone = dayjs.tz.guess();
    const currentDate = dayjs().tz(userTimeZone);

    const startDate = dayjs(course.startDate).tz(userTimeZone).startOf('day');
    const endDate = dayjs(course.endDate).tz(userTimeZone).endOf('day');

    // console.log(currentDate.format(), endDate.format());

    if (currentDate.isAfter(endDate)) return { on: false, msg: 'Meeting period is over' };
    if (!currentDate.isBetween(startDate, endDate)) return { on: false, msg: 'Meeting is out of date range' };

    const activeDays = course?.days?.filter(day => day.checked) || null;

    if (activeDays?.length === 0) {
      const meetingStartTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${course.startTime}`).tz(userTimeZone);
      const meetingEndTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${course.endTime}`).tz(userTimeZone);
      if (currentDate.isBetween(meetingStartTime, meetingEndTime)) {
        return { on: true, msg: `${type} is ongoing` };
      } else if (currentDate.isBefore(meetingStartTime)) {
        return { on: false, msg: `${type} has not started, will start at ${meetingStartTime.format('HH:mm')}` };
      } else {
        return { on: false, msg: `${type} has ended, ended at ${meetingEndTime.format('HH:mm')}` };
      }
    }
    const todayMeeting = activeDays?.find(day => day.day === currentDate.format('dddd'));

    if (todayMeeting) {
      const meetingStartTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${todayMeeting.startTime}`).tz(userTimeZone);
      const meetingEndTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${todayMeeting.endTime}`).tz(userTimeZone);

      if (currentDate.isBetween(meetingStartTime, meetingEndTime)) {
        return { on: true, msg: `${type} is ongoing` };
      } else if (currentDate.isBefore(meetingStartTime)) {
        return { on: false, msg: `${type} has not started, will start at ${meetingStartTime.format('HH:mm')}` };
      }
    } else if (type === "Event") {
      const meetingStartTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${course.startTime}`).tz(userTimeZone);
      const meetingEndTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${course.endTime}`).tz(userTimeZone);

      if (currentDate.isBetween(meetingStartTime, meetingEndTime)) {
        return { on: true, msg: 'Event is ongoing' };
      } else if (currentDate.isBefore(meetingStartTime)) {
        return { on: false, msg: `Event has not started, will start at ${meetingStartTime.format('HH:mm')}` };
      }
    }



    const futureMeetingsMain = [...(course?.days?.filter(day => day.checked) || [])]
    const msg = <div className='flex flex-col  '>
      <div>No meeting now. Check out our schedule below</div>
      {
        futureMeetingsMain.map((day, i) => <span className='text-slate-400'> {day.day}s at {dayjs(`${dayjs().format('YYYY-MM-DD')} ${day.startTime}`, 'YYYY-MM-DD HH:mm').format('hh:mm A')} - {dayjs(`${dayjs().format('YYYY-MM-DD')} ${day.endTime}`, 'YYYY-MM-DD HH:mm').format('hh:mm A')}
          , </span>
        )
      }
    </div>
    return { on: false, msg };

  };

  return (
    <>
      <Fade mountOnEnter unmountOnExit in={open} timeout={400}>
        <div className="relative">
          {contextHolder}
          {/* Backdrop with higher z-index */}
          <div
            onClick={() => handleClick()}
            className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-[999]'
          />

          <Slide in={open} mountOnEnter unmountOnExit timeout={300}>
            <div className='fixed z-[1000] top-10 bottom-10 left-0 rounded-md right-0 lg:w-[80%] overflow-y-auto w-[95%] mx-auto  bg-[#F8F7F4]'>
              <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38]  p-4 lg:px-12 flex justify-between'>
                <p className='font-medium capitalize'>{action} Details</p>
                <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
              </div>
              <div className='py-4 lg:px-10 px-4 '>
                <div className='lg:flex justify-between'>
                  <div className='lg:w-[40%]'>
                    <ImageViewer image={course.thumbnail} />
                    {/* <img src={course.thumbnail} className='w-full h-52 object-cover' alt="" /> */}
                    <div className='p-4'>
                      <p className='font-medium text-base'>{course.title}</p>
                      {course.enrolledStudents?.length > 1 && <div className='flex'>
                        <div className='flex ml-1'>
                          {course.enrolledStudents.slice(0, 6).map(course => <img key={course._id} src={course.profilePicture ? course.profilePicture : '/images/user.png'} className='w-5 rounded-full h-5 -ml-1' alt="" />)}
                        </div>
                        <p className='text-xs ml-2 my-1'>{course.enrolledStudents.length}+ {action === "Event" ? "participants" : "students"} already started</p>
                      </div>}
                      <div className='my-4'>
                        <p className='font-medium'>The {action} includes</p>
                        <div className='flex my-1'>
                          <img className='h-2 my-auto mr-2 w-2' src="/images/Ellipse.png" alt="" />
                          <p className='text-sm'>Learning hours</p>
                        </div>
                        {action !== "Event" && <div className='flex my-1'>
                          <img className='h-2 my-auto mr-2 w-2' src="/images/Ellipse.png" alt="" />
                          <p className='text-sm'>Course modules/assesments</p>
                        </div>}
                        {action !== "Event" && <div className='flex my-1'>
                          <img className='h-2 my-auto mr-2 w-2' src="/images/Ellipse.png" alt="" />
                          <p className='text-sm'>Additional Resources/Materials</p>
                        </div>}
                        {action === "Event" ? <div className='flex my-1'>
                          <img className='h-2 my-auto mr-2 w-2' src="/images/Ellipse.png" alt="" />
                          <p className='text-sm'>Certificate of participation</p>
                        </div> : <div className='flex my-1'>
                          <img className='h-2 my-auto mr-2 w-2' src="/images/Ellipse.png" alt="" />
                          <p className='text-sm'>Certificate of completion</p>
                        </div>}
                      </div>
                      {
                        type === "view" ? course.type === "online" ? isOn().on ? <button onClick={() => startMeeting()} className='bg-primary p-2 my-3 rounded-md px-8 w-[150px]'>{loading ? <Spin /> : "Join Live"}</button> : null : user.role !== 'student' ?
                          <button onClick={() => router.push(`/${action === "Course" ? course.type : "event"}}/${course._id}?page=${action === "Course" ? course.type : "event"}`)} className='bg-primary p-2 my-3 rounded-md px-8'>{course.type}</button> :
                          action === "Event" ? null : <button onClick={() => router.push(`/applicant/${course._id}?page=${action === "Course" ? course.type : "event"}`)} className='bg-primary p-2 my-3 rounded-md px-8'>{course.type}</button>
                          : <button onClick={() => {
                            if (user.id) {
                              parseInt(course.fee) === 0 ? checkTyoe() : setIsModalOpen(true)

                            } else {
                              router.push(`/auth/signup?enroll=${course._id}`)
                            }
                          }} className='bg-primary p-2 my-3  rounded-md px-8'>{(course.type === "pdf" && parseInt(course.fee) > 0) ? "Buy Now" : action === "Event" ? "Book Now" : loading ? <Spin /> : "Enroll Now"}</button>
                      }
                      <div>
                        <Link className='text-primary border border-primary  inline-block p-2 my-2 rounded-md px-8 hover:bg-primary/50 hover:border-black hover:text-black duration-300 ' href={`/${action === "Course" ? "courses" : "events"}/${course._id}?`}>{action} Details</Link>

                      </div>
                    </div>
                    {course.type === "offline" && type === "view" ? <div className='text-sm'>
                      <p><span className='font-bold'>Location:</span> {course.location}</p>
                      <p> <span className='font-bold'>Room:</span> {course.room}</p>
                      {course.days && <>
                        <div className='my-3 font-bold'>Weekly Hours</div>
                        {course.days.map((day, index) => day.checked && <div key={index} className='flex justify-between'>
                          <p>{day.day}</p>
                          <p>{day.startTime}</p>
                          <p>-</p>
                          <p>{day.endTime}</p>
                        </div>)}</>}
                    </div> : null}
                  </div>
                  <div className='lg:w-[58%]'>
                    <p className='text-lg font-bold'>{course.title}</p>
                    {/* <p className='my-2 text-sm font-medium'>This great online course will equip you with the knowledge and basic skills
                needed to design vector graphics using Figma.</p> */}
                    <p className='text-sm'>{course.about}</p>
                    {
                      course.type === "webinar" &&
                      <div className='border border-gray py-3  px-5 rounded-lg my-3'>
                        <p className='text-[18px] font-medium  mb-1 '>Event Details</p>
                        <p className='text-sm '>
                          <span>This webinar  starts from  <span className='font-medium'>{new Date(course?.startDate).toLocaleString('en-US', {
                            day: "numeric",
                            month: "short",
                            weekday: "long",
                          })} </span>to  <span className='font-medium'>{new Date(course?.endDate).toLocaleString('en-US', {
                            day: "numeric",
                            month: "short",
                            weekday: "long",
                          })}</span>
                          </span>
                        </p>
                        <div className='flex mt-1 items-center text-sm   text-yellow-600 gap-3'>
                          {isOn().msg}
                        </div>
                        {isOn().on && (
                          <div className="w-full mt-5">
                            <WebinarVideo
                              videoUrl={course.videoUrl}
                              courseId={course._id}
                              isWebinar={course.type === "webinar"}
                              isEnrolled={Boolean(course.enrolledStudents.find((userIn) => userIn._id === user.id))}
                              autoPlay={isOn().on}
                              onClose={handleClick}
                            />
                          </div>
                        )}
                      </div>
                    }
                    {
                      course.type === "online" &&
                      <div className='border border-gray py-3  px-5 rounded-lg my-3'>
                        <p className='text-[18px] font-medium  mb-1 '>Course Details</p>
                        <p className='text-sm '>
                          <span>This program  starts from  <span className='font-medium'>{new Date(course?.startDate).toLocaleString('en-US', {
                            day: "numeric",
                            month: "short",
                            weekday: "long",
                          })} </span>to  <span className='font-medium'>{new Date(course?.endDate).toLocaleString('en-US', {
                            day: "numeric",
                            month: "short",
                            weekday: "long",
                          })}</span>
                          </span>
                        </p>
                        <div className='flex mt-1 items-center text-sm   text-yellow-600 gap-3'>
                          {isOn().msg}
                        </div>
                      </div>
                    }

                    {type === 'enroll' && <div className='flex my-4'>
                      <div className='flex mr-6'>
                        <img className='w-10 rounded-full my-auto h-10' src={course.instructorImage} alt="" />
                        <div className='ml-3 my-auto'>
                          <p className='text-xs'>Course Tutor</p>
                          <p className='font-medium'>{course.instructorName}</p>
                        </div>
                      </div>
                      {/* <button onClick={() => {
                        if (user.id) {
                          course.fee === 0 ? checkTyoe() : setIsModalOpen(true)

                        } else {
                          router.push(`/auth/signup?enroll=${course._id}`)
                        }
                      }} className='bg-primary p-2 my-3 rounded-md px-8'>{(course.type === "pdf" && parseInt(course.fee) > 0) ? "Buy Now" : action === "Event" ? "Book Now" : loading ? <Spin /> : "Enroll Now"}</button> */}
                    </div>}

                    {course.benefits && <div className='my-3'>
                      <p className='font-bold text-lg'> In this course you'll learn how to</p>
                      <ol className='list-decimal grid grid-cols-2'>
                        {course.benefits.map((single, index) => <li key={index} className='ml-4'>{single}</li>)}
                      </ol>
                    </div>}

                    <div className='text-center'>
                      {type === "view" && course.type === 'pdf' ? <a href={insertAtIndex(course.file, 65)} download target='_blank'> <button className='bg-primary p-1 mx-auto my-3 rounded-md px-8'>Download/Read</button></a> : null}
                    </div>

                    {course.modules && <div>
                      <div className='flex '>
                        <p onClick={() => setActive(0)} className={active === 0 ? 'font-bold border-b py-1 border-primary cursor-pointer' : 'font-bold py-1 cursor-pointer'}>Course Modules</p>
                        <p onClick={() => setActive(1)} className={active === 1 ? 'ml-4 font-bold border-b py-1 border-primary cursor-pointer' : 'font-bold py-1 ml-4 cursor-pointer'}>Course Descriptions</p>
                      </div>
                      {active === 0 ? <div>
                        {course.modules.map((module, index) => <div key={index} className='my-2'>
                          <p className='font-medium my-1'>Module {index + 1}</p>
                          <p>{module.title}</p>
                        </div>)}
                      </div> : <div>
                        {course.modules.map((module, index) => <div key={index} className='my-2'>
                          <p className='font-medium my-1'>Module {index + 1}</p>
                          <p>{module.description}</p>
                        </div>)}
                      </div>}
                    </div>}
                  </div>
                </div>
              </div>
            </div>
          </Slide>

        </div>
      </Fade>

      {/* {
        joinMeeting && <ZoomMeeting setJoinMeeting={setJoinMeeting} joinMeeting={joinMeeting} closeDetail={handleClick} course={course} />
      } */}

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallet={() => payWithWallet()}
        card={() => handleFlutterPayment({
          callback: (response) => {
            checkTyoe()
            setIsModalOpen(false)
            closePaymentModal()
          },
          onClose: () => { },
        })}
      />

      {/* Zoom SDK Container with proper z-index and positioning */}
      {init && (
        <div className="fixed inset-0 z-[1001] bg-white">
          <div
            id="meetingSDKElement"
            className="w-full h-full"
          />
        </div>
      )}
    </>

  );
};

export default CourseDetails;


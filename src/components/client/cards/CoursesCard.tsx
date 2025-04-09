import React, { useState } from 'react';
import { Dropdown, MenuProps, Progress } from 'antd';
import { usePathname } from 'next/navigation';
import CourseDetails from '../modals/CourseDetails';
import AddCourse from '../modals/AddCourse';
import { CourseType } from '@/types/CourseType';
import Share from '../Share';
import Link from 'next/link';
import AssignTutor from '../modals/AssignTutor';
import EnrollStudent from '../modals/EnrollStudent';
import { useAppSelector } from '@/store/hooks';
import ImageViewer from '../ImageViewer';
import Participants from '../Participants';
import apiService from '@/utils/apiService';
import AppointmentModal from '../modals/AppointmentModal';
import { useRouter } from 'next/navigation';
import AddResources from '../modals/AddResources';
import { isActionChecked } from '@/utils/checkPrivilege';

const CoursesCard = ({ course, getCourse }: { course: CourseType, getCourse: () => Promise<void> }) => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [resources, setResources] = useState(false)
  const [edit, setEdit] = useState(false)
  const [deletec, setDelete] = useState(false)
  const [enrolled, setEnrolled] = useState(false)
  const [enroll, setEnroll] = useState(false)
  const user = useAppSelector((state) => state.value);
  const [assign, setAssign] = useState(false)
  const [participants, setParticipants] = useState(false)
  const [appointment, setAppointment] = useState(false)
  const router = useRouter()

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Share course={course} />
      ),
    },
    ...(pathname.includes('admin') ? [
      {
        key: '2',
        label: (
          <p onClick={() => setEnroll(true)} >Enroll Student</p>
        ),
      },
      {
        key: '3',
        label: (
          <p onClick={() => setAssign(true)} >Asign Tutor</p>
        ),
      },
    ] : []),
    ...(course.instructorId === user.id || user.role === 'admin' ? [
      {
        key: '4',
        label: (
          <p onClick={() => {
            if (isActionChecked("Delete Course", user.privileges)) {
              setDelete(true);
            }
          }} >Delete course</p>
          // <p onClick={() => { course.enrolledStudents.length >= 1 ? setEnrolled(true) : setDelete(true) }}>Delete course</p>
        ),
      },
      {
        key: '5',
        label: (
          <p className={`${course.type === `online` ? `cursor-not-allowed` : ``}`}
            onClick={() => {
              if (course.type !== 'online') {
                if (isActionChecked('Edit Course', user.privileges)) {
                  setEdit(true);
                } else {
                  alert('You do not have the permission to Edit Course');
                }
              }
            }}
          >Edit course</p>
        ),
      },
      {
        key: '6',
        label: (
          <p onClick={() => {
            if (isActionChecked("View Course Participant and send email reminder", user.privileges)) {
              setParticipants(true);
            }
          }} >View Participants</p>
        ),
      },
      {
        key: '7',
        label: (
          <p onClick={() => {
            if (isActionChecked("Add, delete and edit additional resources", user.privileges)) {
              setResources(true);
            }
          }} >Add Resources</p>
        ),
      }
    ] : [])
  ];


  const deleteCourse = async () => {
    apiService.delete(`/courses/delete/${course._id}`)
      .then(function (response) {
        getCourse()
        setDelete(false)
        console.log(response)
      })
  }

  function calculateProgress(enrolled: number, target: number) {
    return (enrolled / target) * 100;
  }


  return (
    <div className="p-2 w-full shadow-md my-3 rounded-md bg-white">
      <div className='flex my-2'>
        <img className='w-6 h-6 rounded-full' src={course.instructorImage || "/images/user.png"} alt="" />
        <p className='font-medium ml-3 text-sm'>A course by {course.instructorName}</p>
      </div>
      <ImageViewer image={course.thumbnail} />
      {/* <img className="rounded-md w-full h-44 object-cover" src={course.thumbnail} alt="" /> */}
      <h3 className="font-medium my-3">{course.title}
        {pathname.includes("courses") && pathname.includes("admin") ? <Link href={`/admin/${course._id}?page=${course.type}`} ><button className='bg-primary p-2 rounded-md'>{course.type}</button> </Link> : pathname.includes("courses") ? <button onClick={() => setOpen(true)} className='bg-primary p-2 rounded-md'> {course.type === 'online' ? 'Join Live' : course.type}</button> : <button onClick={() => setOpen(true)} className='bg-primary p-2 rounded-md'>{course.type === 'online' ? 'Join Live' : course.type}</button>}  </h3>

      <p className='text-xs'>{course.about.substring(0, 50)}...</p>

      <div className='flex justify-between my-3'>
        <div>
          <p className='text-xs my-1'>Students {course.enrolledStudents.length}</p>
          <div className='flex ml-1'>
            {course.enrolledStudents.slice(0, 6).map(course => <img key={course._id} src={course.profilePicture ? course.profilePicture : '/images/user.png'} className='w-5 rounded-full h-5 -ml-1' alt="" />)}
            {/* <img src="/images/user.png" className='w-5 h-5' alt="" />
            <img src="/images/user.png" className='w-5 h-5 -ml-2' alt="" />
            <img src="/images/user.png" className='w-5 h-5 -ml-2' alt="" /> */}
          </div>
        </div>

        <div className='w-[70%] '>
          <div className='ml-auto text-right'>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <button className='bg-transparent'>
                <img className='w-4 h-4' src="/images/icons/edit.svg" alt="" />
              </button>
            </Dropdown>
          </div>
          <div className='flex my-auto'>
            <p className='text-xs font-medium w-full'>Overall progress</p>
            <Progress percent={parseInt(calculateProgress(course.enrolledStudents.length, course.target).toFixed())} size="small" />
          </div>
        </div>
      </div>
      <CourseDetails course={course} action={"Course"} open={open} call={null} type='view' handleClick={() => setOpen(false)} />
      <AddCourse course={course} open={edit} handleClick={() => setEdit(false)} />
      <EnrollStudent open={enroll} handleClick={() => setEnroll(false)} course={course} />
      <AssignTutor open={assign} handleClick={() => setAssign(false)} course={course} getCourse={() => getCourse()} />
      {
        deletec && <div>
          <div onClick={() => setDelete(false)} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
          <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[30%] w-[90%] h-[50%] mx-auto z-20 bg-[#F8F7F4]'>
            <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
              <p className='font-medium'></p>
              <img onClick={() => setDelete(false)} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
            </div>
            <div className='lg:p-10 p-4 text-center'>
              <h1 className='text-2xl'>Are you sure you want to delete this course?</h1>
              <div>
                <div className='flex my-4 justify-center'>
                  <button onClick={() => deleteCourse()} className='mx-4 bg-primary p-2 rounded-md'>Delete</button>
                  <button onClick={() => setDelete(false)} className='mx-4'>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {
        enrolled && <div>
          <div onClick={() => setEnrolled(false)} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
          <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[30%] w-[90%] h-[50%] mx-auto z-20 bg-[#F8F7F4]'>
            <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
              <p className='font-medium'></p>
              <img onClick={() => setEnrolled(false)} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
            </div>
            <div className='lg:p-10 p-4 text-center'>
              <h1 className='text-2xl'>You can't delete this course because someone has already enrolled!</h1>
              <div>
                <div className='flex my-4 justify-center'>
                  <button onClick={() => setEnrolled(false)} className='mx-4 bg-primary p-2 rounded-md'>Go back</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <Participants view={participants} event={course} hndelClick={() => setParticipants(false)} type="Course" />
      <AddResources course={course._id} open={resources} handleClick={() => setResources(false)} />
    </div>
  );
};

export default CoursesCard;
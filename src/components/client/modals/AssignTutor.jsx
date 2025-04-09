import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { CourseType } from '@/types/CourseType';
import { UserType } from '@/types/UserType';
import { notification } from 'antd';
import apiService from '@/utils/apiService';

const AssignTutor = ({ open, handleClick, course, getCourse }) => {
  const user = useAppSelector((state) => state.value);

  const [enrollStudent, setEnrollStudent] = useState("")
  const [loading, setLoading] = useState(false)
  const [instructors, setInstructors] = useState([])
  const [api, contextHolder] = notification.useNotification();

  const getStudents = () => {
    apiService.get('user/instructors')
      .then(function (response) {
        setInstructors(response.data.instructors)
        // console.log(response.data)
      })
  }
  const enroll = () => {
    setLoading(true)
    apiService.post(`courses/assign/${course._id}`, {
      id: enrollStudent
    })
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        getCourse()
        handleClick()
        api.open({
          message: "Tutor assigned successfully!"
        });
      })
      .catch(err => {
        setLoading(false)
        api.open({
          message: err.response.data.message
        });
      })
  }

  const unAssign = (id) => {
    // setLoading(true)
    apiService.post(`courses/assign/${course._id}`, {
      id: id
    })
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        getCourse()
        handleClick()
        api.open({
          message: "Tutor unAssigned successfully!"
        });
      })
      .catch(err => {
        setLoading(false)
        api.open({
          message: err.response.data.message
        });
      })
  }

  useEffect(() => {
    getStudents()
  }, [])
  return (
    open && <div>
      {contextHolder}
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[50%] w-[90%] h-[80%] overflow-y-scroll mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <p className='font-medium'>Assign Tutor</p>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:p-10 p-4'>
          <div className='my-3'>
            <div className='w-full'>
              <label className='text-sm font-medium my-2'>Select Tutor</label>
              <select onChange={e => setEnrollStudent(e.target.value)} value={enrollStudent} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                <option className='hidden' value="">Select a Tutor</option>
                {instructors.map(student => <option key={student.id} value={student.id}>{student.fullname}</option>)}
              </select>
            </div>
            {course.assignedTutors?.length >= 1 && <div className='mt-4'>
              <p className='text-sm font-medium'>Assigned Tutors</p>
              <div>
                {course.assignedTutors.map((single, index) => <div className='flex justify-between w-[40%] my-2' key={index}>
                  <img src={single.profilePicture  ? single.profilePicture : '/images/user.png'} className='w-8 h-8 rounded-full' alt="" />
                  <p className='capitalize'>{single.fullname}</p>
                  <img onClick={() => unAssign(single._id)} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
                </div>)}
              </div>
            </div>}
          </div>
          <div>
            <div className='flex'>
              <button onClick={() => enroll()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'> {loading ? "loading..." : "Assign"}</button>
              <button onClick={() => handleClick()} className='mx-4'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTutor;
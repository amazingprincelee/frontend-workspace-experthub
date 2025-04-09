import { useAppSelector } from '@/store/hooks';
import { AssesmentType } from '@/types/AssesmentType';
import apiService from '@/utils/apiService';
import React, { useEffect, useState } from 'react';

const SendAssesment = ({ open, handleClick, studentId }: { open: boolean, handleClick: any, studentId: string }) => {
  const [assesment, setAssesment] = useState("")
  const [loading, setLoading] = useState(false)
  const [assesments, setAssesments] = useState<AssesmentType | []>([])
  const user = useAppSelector((state) => state.value);
  const getAssesment = async () => {
    await apiService.get(`assessment/get-assessment-questions`)
      .then(function (response) {
        setAssesments(response.data.assessmentQuestions.reverse())
        // console.log(response.data.assessmentQuestions)
      })
  }

  useEffect(() => {
    getAssesment()
  }, [])

  const assign = () => {
    setLoading(true)
    try {
      apiService.put(`assessment/assign/${assesment}`, {
        studentId,
        userId:user.id,
      })
        .then(function (response) {
          setLoading(false)
          console.log(response.data)
          handleClick()
        })
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  return (
    open && <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[50%] w-[90%] h-[40%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <p className='font-medium'>Send Assesment</p>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:p-10 p-4'>
          <div className='flex justify-between my-3'>
            <div className='w-full'>
              <label className='text-sm font-medium my-2'>Select Assesment</label>
              <select onChange={e => setAssesment(e.target.value)} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                <option value="" className='hidden'>Select Assesment to assign</option>
                {assesments.map((assesment: AssesmentType) => <option key={assesment._id} value={assesment._id}>{assesment.title}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div className='flex'>
              <button onClick={() => assign()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'> {loading ? "loading..." : "Assign"}</button>
              <button onClick={() => handleClick()} className='mx-4'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendAssesment;
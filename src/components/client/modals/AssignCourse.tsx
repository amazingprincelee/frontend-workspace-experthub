import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { CategoryType } from '@/types/CourseType';
import apiService from '@/utils/apiService';
import axios from 'axios';

const AssignCourse = ({ open, handleClick, studentId }: { open: boolean, handleClick: any, studentId: string }) => {
  const user = useAppSelector((state) => state.value);
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [categoryIndex, setCategoryIndex] = useState("")

  const [categories, setCategories] = useState<CategoryType[]>([])

  const getCategories = () => {
    apiService.get('category/all').then(function (response) {
      console.log(response.data)
      setCategories(response.data.category)
    }).catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    getCategories()
  }, [])

  const assign = async () => {
    setLoading(true)
    try {
      const res = await apiService.put(`user/updateProfile/${studentId}`, {
        course: category === "" ? categoryIndex : category,
        assignerId: user.id,
      })
      setLoading(false)
      console.log(res.data)
      handleClick()
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
          <p className='font-medium'>Assign Course</p>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:p-10 p-4'>
          <div className='flex justify-between my-1'>
            <div className='w-full'>
              <label className='text-sm font-medium my-1'>Course Category</label>
              <select onChange={e => setCategoryIndex(e.target.value)} value={categoryIndex} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                <option className='hidden' value="">Select Category</option>
                {categories.map((single, index) => <option key={index} value={single.category}>{single.category}</option>)}
              </select>
            </div>
            {categories.map(single => single.category === categoryIndex && single.subCategory.length >= 1 && <div key={single._id} className='w-full ml-3'>
              <label className='text-sm font-medium my-1'>Sub Category</label>
              <select onChange={e => setCategory(e.target.value)} value={category} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                <option className='hidden' value="">Select Sub-Category</option>
                {single.subCategory.map((sub, index) => <option key={index} value={sub}>{sub}</option>)}
              </select>
            </div>)}
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

export default AssignCourse;
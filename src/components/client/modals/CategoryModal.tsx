import React, { useState } from 'react';
import { notification } from 'antd';
import { CategoryType } from '@/types/WorkspaceType';
import apiService from '@/utils/apiService';

const CategoryModal = ({ open, fetch, handleClick, category }: { open: boolean, fetch?: any, handleClick: any, category: CategoryType | null }) => {
  const [loading, setLoading] = useState(false)
  const [categoryText, setCategory] = useState(category?.category || "")
  const [subCategory, setSubCategory] = useState<string[]>(category?.subCategory || [])
  const [api, contextHolder] = notification.useNotification();
  const [newCat, setNewCat] = useState("")

  const handleSubmit = () => {
    setLoading(true)
    apiService.post('category/new', {
      category: categoryText,
      subCategory
    }).then(function (response) {
      // console.log(response.data)
      setLoading(false)
      handleClick()
      api.open({
        message: "Category added successfully!"
      });
    })
      .catch(err => {
        setLoading(false)
        api.open({
          message: err.response.data.message
        });
      })
  }

  const handleEdit = () => {
    setLoading(true)
    apiService.put(`category/edit/${category?._id}`, {
      category: categoryText,
      subCategory
    }).then(function (response) {
      // console.log(response.data)
      setLoading(false)
      fetch()
      handleClick()
      api.open({
        message: "Category edited successfully!"
      });
    })
      .catch(err => {
        setLoading(false)
        api.open({
          message: err.response.data.message
        });
      })
  }

  const remove = (targetIndex: any) => {
    const newArray = subCategory.filter((item, index) => index !== targetIndex);
    setSubCategory(newArray)
  }
  
  return (
    open && <div>
      {contextHolder}
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[50%] w-[90%] overflow-y-auto h-[80%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <p className='font-medium'>{category === null ? "Add" : "Edit"} Category</p>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:p-10 p-4'>
          <input onChange={(e) => setCategory(e.target.value)} value={categoryText} type="text" className='p-3 border my-1 rounded-md w-full' placeholder='Enter Category' />

          {
            subCategory.map((cat, index) => <div className='flex justify-between my-2' key={index}>
              <p className='text-lg'>{cat}</p>
              <button onClick={() => remove(index)} className='bg-primary p-1 text-xs rounded-md text-white'>Delete</button>
            </div>)
          }
          <input onChange={(e) => setNewCat(e.target.value)} type="text" className='p-3 border my-1 rounded-md w-full' placeholder='Enter Sub Category' />
          <button onClick={() => { setSubCategory([...subCategory, newCat]); setNewCat("") }} value={newCat} className='p-3 bg-primary my-6'>Add</button>
          <div>
            <div className='flex'>
              {category === null ? <button onClick={() => handleSubmit()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'> {loading ? "loading..." : "Submit"}</button> : <button onClick={() => handleEdit()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'> {loading ? "loading..." : "Edit"}</button>}

              <button onClick={() => handleClick()} className='mx-4'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CategoryModal;
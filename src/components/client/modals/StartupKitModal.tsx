import { CourseType } from '@/types/CourseType';
import { ResourceType } from '@/types/ResourceType';
import apiService from '@/utils/apiService';
import { notification } from 'antd';
import { error } from 'console';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import Video from '../icons/video';

const StartupKitModal = ({ open, handleClick }: { open: boolean, handleClick: any }) => {
  const uploadRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<FileList | null>()
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [link, setLink] = useState("")

  const [api, contextHolder] = notification.useNotification();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files
    setFile(e.target.files)

    const reader = new FileReader()
    if (files && files.length > 0) {

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          // const type = files[0].name.substr(files[0].name.length - 3)
          setImage(reader.result as string)
        }
      }
    }
  }


  const add = () => {
    if (title && link && text) {
      setLoading(true)
      const formData = new FormData()
      file && formData.append("image", file[0])
      formData.append("title", title)
      formData.append("link", link)
      formData.append("text", text)

      apiService.post(`start-up-kit/new`,
        formData
      )
        .then(function (response) {
          console.log(response.data)
          setLoading(false)
          handleClick()
        }).catch(error => {
          api.open({
            message: error.response.data.message
          });
          setLoading(false)
        })
    } else {
      api.open({
        message: "Please fill all fields!"
      });
    }
  }

  return (
    open && <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 rounded-md overflow-y-auto right-0 lg:w-[50%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <p className='font-medium'>Add Startup Kit</p>

          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:p-10 p-4'>
          {contextHolder}
          <div>
            <p className='text-sm font-medium my-1'>Image</p>
            {image ? <img onClick={() => uploadRef.current?.click()} src={image} className='w-full object-cover h-40' alt="" /> :
              <button className='border border-[#1E1E1ED9] p-2 my-1 rounded-md font-medium w-full' onClick={() => uploadRef.current?.click()}>
                <img src="/images/icons/upload.svg" className='w-8 mx-auto' alt="" />
                <p></p></button>}
          </div>
          <div className='flex my-1'>
          </div>
          <input
            onChange={handleImage}
            type="file"
            name="identification"
            accept="image/*"
            ref={uploadRef}
            hidden
            multiple={false}
          />

          <div className='flex justify-between my-1'>
            <div className='w-full'>
              <label className='text-sm font-medium my-1'>Title</label>
              <input onChange={e => setTitle(e.target.value)} value={title} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
            </div>
          </div>
          <div className='flex justify-between my-1'>
            <div className='w-full'>
              <label className='text-sm font-medium my-1'>Link</label>
              <input onChange={e => setLink(e.target.value)} value={link} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
            </div>
          </div>

          <div className='my-1'>
            <label className='text-sm font-medium my-1'>Description</label>
            <textarea onChange={e => setText(e.target.value)} value={text} className='border rounded-md border-[#1E1E1ED9] w-full h-32 p-2 bg-transparent'></textarea>
          </div>
          <div>
            <div className='flex'>
              <button onClick={() => add()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>{loading ? 'loading...' : 'Add Kit'}</button>
              <button onClick={() => handleClick()} className='mx-4'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupKitModal;
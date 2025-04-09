import { CourseType } from '@/types/CourseType';
import { ResourceType } from '@/types/ResourceType';
import apiService from '@/utils/apiService';
import { notification } from 'antd';
import { error } from 'console';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import Video from '../icons/video';

const AddResources = ({ open, handleClick, material, course }: { open: boolean, handleClick: any, material?: ResourceType, course: string }) => {
  const uploadRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLInputElement>(null)

  const [image, setImage] = useState(material?.image || "")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<FileList | null>()
  const [title, setTitle] = useState(material?.title || "")
  const [about, setAbout] = useState(material?.aboutCourse || "")
  const [privacy, setPrivacy] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState(material?.websiteUrl || "")
  // const [assignedCourse, setAssignedCourse] = useState(material?.assignedCourse || "")
  const [api, contextHolder] = notification.useNotification();
  const [courses, setCourses] = useState([])
  const [fileName, setFileName] = useState("")
  const pdfUploadRef = useRef<HTMLInputElement>(null)
  const [type, setType] = useState("link")
  const [pdf, setPdf] = useState("")
  const [video, setVideo] = useState("")

  const getCourses = () => {
    apiService.get("courses/all")
      .then(function (response) {
        setCourses(response.data.courses)
        // console.log(response.data)
      })
  }

  useEffect(() => {
    getCourses()
  }, [])
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

  const setEdit = () => {
    apiService.put(`resources/edit/${material?._id}`, {
      title,
      aboutCourse: about,
      websiteUrl,
    })
      .then(function (response) {
        console.log(response.data)
        handleClick()
      })
  }

  const formattedOptions = courses.map((option: CourseType) => ({ value: option._id, label: option.title }));


  const add = () => {
    if (title && about && websiteUrl) {
      setLoading(true)
      // const formData = new FormData()
      // file && formData.append("image", file[0])
      // formData.append("title", title)
      // formData.append("aboutCourse", about)
      // formData.append("assignedCourse", course)
      // formData.append("type", type)

      // if (type === 'link') {
      //   formData.append("websiteUrl", websiteUrl)
      // } else if (type === 'video') {
      //   formData.append("websiteUrl", video)
      // } else if (type === 'pdf') {
      //   formData.append("websiteUrl", pdf)
      // }

      apiService.post(`resources/add-new`,
        {
          image,
          title,
          type,
          assignedCourse: course,
          aboutCourse: about,
          video,
          pdf,
          websiteUrl
        }
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

  const handlePdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    const reader = new FileReader()
    if (files && files.length > 0) {
      setFileName(files[0].name)

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          setPdf(reader.result as string)
          // setImage(reader.result as string)
        }
      }
    }
  }

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files
    // setFile(e.target.files)

    const reader = new FileReader()
    if (files && files.length > 0) {

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          const type = files[0].name.substr(files[0].name.length - 3)
          setVideo(reader.result as string)
        }
      }
    }
  }


  return (
    open && <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 rounded-md overflow-y-auto right-0 lg:w-[50%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          {material ? <p className='font-medium'>Edit Resources</p> : <p className='font-medium'>Add Resources</p>
          }
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:p-10 p-4'>
          {contextHolder}
          <div>
            <p className='text-sm font-medium my-1'>Resource Image</p>
            {image ? <img onClick={() => uploadRef.current?.click()} src={image} className='w-full h-40' alt="" /> :
              <button className='border border-[#1E1E1ED9] p-2 my-1 rounded-md font-medium w-full' onClick={() => uploadRef.current?.click()}>
                <img src="/images/icons/upload.svg" className='w-8 mx-auto' alt="" />
                <p> Add course</p></button>}
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
              <label className='text-sm font-medium my-1'>Title of Resources</label>
              <input onChange={e => setTitle(e.target.value)} value={title} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
            </div>
            {/* <div className='w-[48%]'>
              <label className='text-sm font-medium my-1'>Privacy</label>
              <select onChange={e => setPrivacy(e.target.value)} value={privacy} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                <option value=""></option>
              </select>
            </div> */}
          </div>
          {/* <div className='my-1'>
            <label className='text-sm font-medium my-1'>Assign Course</label>
            <Select
              isMulti={false}
              options={formattedOptions}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(e: any) => { setAssignedCourse(e.value) }}
            />
          </div> */}
          <div className='w-[48%]'>
            <label className='text-sm font-medium my-1 inline-flex items-center'>Course type</label>
            <select onChange={(e) => setType(e.target.value)} value={type} className='border rounded-md w-full border-[#1E1E1ED9] p-2.5 bg-transparent'>
              <option value="link">Link</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          {type === 'link' && <div className='my-1'>
            <label className='text-sm font-medium my-1'>Website Url/link</label>
            <input onChange={e => setWebsiteUrl(e.target.value)} value={websiteUrl} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
          </div>}
          {
            type === 'pdf' && <div>
              <button className='w-full flex my-3' onClick={() => pdfUploadRef.current?.click()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FDC332" className="bi bi-file-earmark-arrow-up" viewBox="0 0 16 16">
                  <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z" />
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                </svg>
                <p className='ml-4 text-sm'> Click to upload</p>
              </button>
              <p className='text-sm'>{fileName}</p>
            </div>
          }
          <input
            onChange={handlePdf}
            type="file"
            name="identification"
            accept=".pdf"
            ref={pdfUploadRef}
            hidden
            multiple={false}
          />
          {
            type === 'video' && <>
              <div onClick={() => uploadRef.current?.click()} className='w-full gap-1 my-3 flex items-center'>
                <span className='text-primary text-[18px]'><Video /></span>
                <span className='text-sm'>Add Video to Sub-title</span>
              </div>
              {video && <video key={video} controls className={`rounded-lg w-full video`} width="250" >
                <source src={video} type="video/mp4" />
              </video>}
            </>
          }
          <input
            onChange={handleVideo}
            type="file"
            name="identification"
            ref={videoRef}
            accept='video/*'
            hidden
            multiple={false}
          />

          <div className='my-1'>
            <label className='text-sm font-medium my-1'>About course</label>
            <textarea onChange={e => setAbout(e.target.value)} value={about} className='border rounded-md border-[#1E1E1ED9] w-full h-32 p-2 bg-transparent'></textarea>
          </div>
          <div>
            <p className='text-sm my-4'>By uploading you agree that this course is a product of you
              and not being forged<input className='ml-2' type="checkbox" /></p>
            <div className='flex'>
              {material ? <button onClick={() => setEdit()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>{loading ? 'loading...' : 'Edit Resource'}</button> : <button onClick={() => add()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>{loading ? 'loading...' : 'Add Resource'}</button>
              }
              <button onClick={() => handleClick()} className='mx-4'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddResources;
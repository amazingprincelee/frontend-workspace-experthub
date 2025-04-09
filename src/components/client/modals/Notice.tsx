import React, { useEffect, useRef, useState } from 'react';
import { Spin, notification } from 'antd';
import category from '@/app/admin/category/page';
import { CategoryType, ThumbnailType } from '@/types/CourseType';
import apiService from '@/utils/apiService';

const Notice = ({ open, handleClick, recipient }: { open: boolean, handleClick: any, recipient?: String }) => {
  const [api, contextHolder] = notification.useNotification();
  const [categories, setCategories] = useState<CategoryType[]>([])
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [categoryIndex, setCategoryIndex] = useState("")
  const states_in_nigeria = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "Federal Capital Territory"
  ]

  const [role, setRole] = useState("student")
  const [state, setState] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")
  const [referreed, setRefered] = useState("")
  const [cancel, setCancel] = useState("")
  const [action, setAction] = useState("")
  const [image, setImage] = useState<ThumbnailType>()
  const uploadRef = useRef<HTMLInputElement>(null)

  const createNotice = () => {
    setLoading(true)
    apiService.post('notice/new', {
      title,
      body: description,
      role,
      country: "nigeria",
      category: category === "" ? categoryIndex : category,
      state,
      link,
      page: referreed,
      asset: image,
      cancel: cancel === 'yes' ? true : false,
      action,
      recipient
    }).then(function (response) {
      console.log(response.data)
      setLoading(false)
      api.open({
        message: "Notice sent out successfully!"
      });
      handleClick()
    }).catch(error => {
      console.log(error)
      setLoading(false)
      api.open({
        message: error.response.data.message
      });
    })
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files
    // setFile(e.target.files)

    const reader = new FileReader()
    if (files && files.length > 0) {

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          const type = files[0].name.substr(files[0].name.length - 3)
          setImage({
            type: type === "mp4" ? "video" : "image",
            url: reader.result as string
          })
        }
      }
    }
  }

  const getCategories = () => {
    apiService.get('category/all').then(function (response) {
      // console.log(response.data)
      setCategories(response.data.category)
    }).catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    getCategories()
  }, [])


  return (
    open && <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 overflow-y-auto rounded-md right-0 lg:w-[40%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <p className='font-medium'>Send Notice</p>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        {contextHolder}
        <div className='lg:mx-12 mx-4 my-4'>
          <div>
            <p className='text-sm font-medium my-1'></p>
            {image ? image.type === 'image' ? <img onClick={() => uploadRef.current?.click()} src={image?.url} className='w-full object-cover h-52' alt="" /> : <video
              onClick={() => uploadRef.current?.click()}
              src={image.url}
              width="500"
              autoPlay muted
              className="embed-responsive-item w-full object-cover h-full"
            >
              <source src={image.url} type="video/mp4" />
            </video> :
              <button className='border border-[#1E1E1ED9] p-2 my-1 rounded-md font-medium w-full' onClick={() => uploadRef.current?.click()}>
                <img src="/images/icons/upload.svg" className='w-8 mx-auto' alt="" />
                <p> Add Image</p>
              </button>}
            <input
              onChange={handleImage}
              type="file"
              name="identification"
              ref={uploadRef}
              accept='video/*,image/*'
              hidden
              multiple={false}
            />
          </div>
          {recipient ? null : <>
            <div className='my-2'>
              <select onChange={(e) => setRole(e.target.value)} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
                <option value="all">All Users</option>
              </select>
            </div>
            {role !== 'all' && <>
              <div className='w-full my-2'>
                {/* <label className='text-sm font-medium my-2'>Course Category</label> */}
                <select onChange={e => setCategoryIndex(e.target.value)} value={categoryIndex} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                  <option className='hidden' value="">Select Course Category</option>
                  {categories.map((single, index) => <option key={index + single.category} value={single.category}>{single.category}</option>)}
                </select>
              </div>
              {categories.map(single => single.category === categoryIndex && single.subCategory.length >= 1 && <div key={single._id} className='w-full my-2'>
                {/* <label className='text-sm font-medium my-1'>Sub Category</label> */}
                <select onChange={e => setCategory(e.target.value)} value={category} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                  <option className='hidden' value="">Select Sub-Category</option>
                  {single.subCategory.map((sub, index) => <option key={index + sub} value={sub}>{sub}</option>)}
                </select>
              </div>)}
              <div className='my-2'>
                <select onChange={e => setState(e.target.value)} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                  <option className='hidden' value="">Select State</option>
                  {states_in_nigeria.map((state, index) => <option key={index + state} value={state}>{state}</option>)}
                </select>
              </div></>}
          </>}
          <div className='my-2'>
            <input onChange={e => setTitle(e.target.value)} value={title} type="text" placeholder='Title' className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
          </div>
          <div className='my-2'>
            <textarea onChange={e => setDescription(e.target.value)} value={description} placeholder='Description' className='border rounded-md w-full h-32 border-[#1E1E1ED9] p-2 bg-transparent'></textarea>
          </div>
          <div className='my-2'>
            <input onChange={e => setLink(e.target.value)} value={link} type="text" placeholder='Url/Link' className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
          </div>
          <div className='my-2'>
            <select onChange={e => setRefered(e.target.value)} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
              <option value="" className='hidden'>Referred Pages</option>
              <option value="Courses">Courses</option>
              <option value="Events">Events</option>
              <option value="Admissions">Admissions</option>
              <option value="Assessment">Assessment</option>
              <option value="Profile">Profile</option>
              <option value="Survey">Survey</option>
            </select>
          </div>
          <div className='my-2'>
            <select onChange={e => setCancel(e.target.value)} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
              <option value="" className='hidden'>Do you want to add CANCEL option?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className='my-2'>
            <select onChange={e => setAction(e.target.value)} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
              <option value="" className='hidden'>Call to Action</option>
              <option value="Book Now">Book Now</option>
              <option value="Call us">Call us</option>
              <option value="Learn More">Learn More</option>
              <option value="Buy Now">Buy Now</option>
              <option value="Email us">Email us</option>
              <option value="Apply Now">Apply Now</option>
              <option value="Enroll Now">Enroll Now</option>
              <option value="Share Now">Share Now</option>
              <option value="View Now">View Now</option>
              <option value="Act Now">Act Now</option>
              <option value="Join Live">Join Live</option>
              <option value="Fill Now">Fill Now</option>
            </select>
          </div>
          <div className='my-3'>
            <button onClick={() => createNotice()} className='p-3 bg-primary px-6 rounded-md'>{loading ? <Spin /> : 'Send'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
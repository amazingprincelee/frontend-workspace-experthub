import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { CategoryType, CourseType } from '@/types/CourseType';
import { Spin, notification } from 'antd';
import Select from 'react-select';
import { UserType } from '@/types/UserType';
import apiService from '@/utils/apiService';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import SelectCourseDate from '../date-time-pickers/SelectCourseDate'
import Video from '../icons/video';
import Bin from '../icons/bin';
import Play from '../icons/play';
import Pause from '../icons/pause';
import Replace from '../icons/replace';
import { AxiosProgressEvent } from 'axios';
import ScheduledCourse from '../date-time-pickers/ScheduledCourse';
import { useRouter } from 'next/navigation';

dayjs.extend(isBetween)
dayjs.extend(advancedFormat)


interface Layout {
  title: string,
  videoUrl: string,
  video: File | null
}
const AddEvents = ({ open, handleClick, course, setShowPremium }: { open: boolean, handleClick: any, course: CourseType | null, setShowPremium?: Dispatch<SetStateAction<boolean>> }) => {

  const user = useAppSelector((state) => state.value);
  const uploadRef = useRef<HTMLInputElement>(null)
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [about, setAbout] = useState(course?.about || "")
  const [startDate, setStartDate] = useState(course?.startDate || undefined)
  const [endDate, setEndDate] = useState(course?.endDate || undefined)
  const [startTime, setStartTime] = useState(course?.startTime || undefined)
  const [endTime, setEndTime] = useState(course?.endTime || undefined)
  const [striked, setStriked] = useState<number>(course?.strikedFee || 0)
  const [fee, setFee] = useState<number>(course?.fee || 0)
  const [duration, setDuration] = useState<number>(course?.timeframe?.value || course?.duration || 0)
  const [timeframe, setTimeframe] = useState(course?.timeframe?.unit || "days")

  const [category, setCategory] = useState(course?.category || "")
  const [categoryIndex, setCategoryIndex] = useState("")
  const [liveCourses, setLiveCourses] = useState([])
  const [conflict, setConflict] = useState(false)
  const [userProfile, setUser] = useState<UserType>();

  const [type, setType] = useState(course?.type || "offline")
  const [title, setTitle] = useState(course?.title || "")
  const [image, setImage] = useState<any>(course?.thumbnail || null)
  const [location, setLocation] = useState(course?.loaction || "")
  const [target, setTarget] = useState(course?.target || 0)
  const [room, setRoom] = useState(course?.room || "")
  const [loading, setLoading] = useState(false)
  const [scholarship, setScholarship] = useState([])
  const [students, setStudents] = useState([])
  const [mode, setMode] = useState("")


  let layout = {
    title: "",
    videoUrl: "",
    video: null
  }

  const [days, setDays] = useState(course?.days || [{
    day: "Monday",
    startTime: "",
    endTime: "",
    checked: false
  },
  {
    day: "Tuesday",
    startTime: "",
    endTime: "",
    checked: false
  },
  {
    day: "Wednesday",
    startTime: "",
    endTime: "",
    checked: false
  },
  {
    day: "Thursday",
    startTime: "",
    endTime: "",
    checked: false
  },
  {
    day: "Friday",
    startTime: "",
    endTime: "",
    checked: false
  },
  {
    day: "Saturday",
    startTime: "",
    endTime: "",
    checked: false
  },
  {
    day: "Sunday",
    startTime: "",
    endTime: "",
    checked: false
  }
  ])
  const [video, setVideo] = useState<Layout>(course?.videoUrl ? { ...layout, videoUrl: course.videoUrl } : layout)
  const [play, setPlay] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)


  const getStudents = () => {
    apiService.get('user/students')
      .then(function (response) {
        setStudents(response.data.students)
        // console.log(response.data)
      })
  }
  const handlePlayClick = () => {
    const video = document.querySelector(`video.video`) as HTMLVideoElement;

    if (video) {
      if (video.paused) {
        video.play();
        setPlay(true)
      } else {
        video.pause();
        setPlay(false)
      }
    }
  };
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      let updatedVideo = video;

      const videoUrl = URL.createObjectURL(files[0]);
      updatedVideo = { ...updatedVideo, video: files[0], videoUrl };


      const videoElement = document.createElement("video");
      videoElement.src = videoUrl;
      videoElement.addEventListener("loadedmetadata", () => {
        const durationInMinutes = Math.round(videoElement.duration / 60); // Duration in minutes
        setDuration(durationInMinutes);
      });

      setVideo(updatedVideo);
    }

  };
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files
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

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (user.role === 'tutor' && (e.target.value === "online" && (!userProfile?.premiumPlan || userProfile?.premiumPlan === "basic")) && setShowPremium) {
      handleClick()
      setShowPremium(true)
    } else {
      setType(e.target.value)
    }
  }
  const edit = () => {
    try {
      setLoading(true)

      apiService.put(`events/edit/${course?._id}`,
        {
          // image,
          title,
          about,
          target,
          duration: duration.toString(),
          type,
          startDate,
          endDate,
          startTime,
          endTime,
          category,
          fee: fee.toString(),
          strikedFee: striked.toString(),
          scholarship: "students",
          room,
          location,
          videoUrl: video.videoUrl,
          days,
          timeframe: {
            value: duration,
            unit: timeframe
          },
          // videos,
          // pdf
        }
      )
        .then(function (response) {
          console.log(response.data)
          setLoading(false)
          handleClick()
        })
    } catch (e) {
      console.log(e)

    }
  }

  const getScholarship = () => {
    const arrayOfIds = scholarship.map((object: any) => object.value)
    return arrayOfIds
  }
  const uploadVideo = async () => {
    try {
      const { video: videoFIle, videoUrl } = video

      if (videoUrl.includes(`res.cloudinary.com`)) return;
      if (!videoFIle) return;
      const { data } = await apiService.get('courses/cloudinary/signed-url');
      console.log(data);

      const formData = new FormData();
      formData.append('file', videoFIle);
      formData.append('api_key', data.apiKey);
      formData.append('timestamp', data.timestamp);
      formData.append('signature', data.signature);

      const { data: dataCloud } = await apiService.post(`https://api.cloudinary.com/v1_1/${data.cloudname}/video/upload`, formData, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });
      console.log(dataCloud);

      setVideo({
        ...video,
        videoUrl: dataCloud.secure_url
      });

      return dataCloud.secure_url
    } catch (e) {
      console.error(e, `\n from uploader`);
      throw e
    }
  };

  const add = async () => {
    // console.log(getScholarship())

    if (type === `online` && conflict) {
      setActive(1)
      return api.open({
        message: "You have chosen a disabled time please check",
      });
    }
    if (title && about && ((type === "offline" || type === "online") && duration) && category && image && mode && type === "offline" ? startDate && endDate && startTime && endTime && room && location : type === "online" ? startDate && endDate && startTime && endTime : startDate && endDate && days.filter((day: any) => day.checked && day.startTime).length !== 0) {
      let videoUrl = null
      if (type === 'webinar') {

        if (!video.video) {
          return api.open({
            message: `You must upload a video file to create this event`,
          });
        }
        setUploading(true);
        try {
          videoUrl = await uploadVideo();
        } catch (e) {
          console.error(e);
          setUploading(false);
          return api.open({
            message: `Something went wrong during video upload`,
          });
        }

        setUploading(false);
      }
      setLoading(true)


      const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
      const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

      const startDateTime = dayjs.utc(`${formattedStartDate}T${startTime || "00:00"}:00`);
      const endDateTime = dayjs.utc(`${formattedEndDate}T${endTime || "00:00"}:00`);
      const startDateJS = startDateTime.toDate();
      const endDateJS = endDateTime.toDate();


      apiService.post(`events/add-event/${user.id}`,
        {
          asset: image,
          title,
          about,
          duration: duration.toString(),
          mode,
          type,
          target,
          startDate: new Date(startDateJS).toISOString(),
          endDate: new Date(endDateJS).toISOString(),
          startTime,
          endTime,
          category: category === "" ? categoryIndex : category,
          fee: fee.toString(),
          strikedFee: striked.toString(),
          room,
          location,
          scholarship: getScholarship(),
          videoUrl,
          days,
          timeframe: {
            value: duration,
            unit: timeframe
          },
        }
      )
        .then(function (response) {
          // console.log(response.data)
          api.open({
            message: "Events Created Successfully!"
          });
          setLoading(false)
          router.refresh()
          handleClick()

        }).catch(error => {
          api.open({
            message: error.response.data.message
          });
          if (error.response.data.showPop && setShowPremium) {
            setShowPremium(true)
          }
        })
    } else {
      api.open({
        message: "Please fill all fields!"
      });
    }
  }
  useEffect(() => {
    if (type === 'online' && startTime) {
      const [hours, minutes] = startTime.split(':');
      const startDateIn = new Date(new Date(startDate || "").setHours(parseInt(hours), parseInt(minutes)));
      const endDateIn = new Date()
      endDateIn.setTime(startDateIn.getTime() + ((duration || 1) * 60000))
      const endTime = dayjs(endDateIn).format('HH:mm')
      setEndTime(endTime);
      setEndDate(dayjs(endDateIn).format('YYYY-MM-DD'));

    } else if (type !== "offline" && type !== "webinar") {
      setDuration(0);
    }
    if (duration > 40 && type !== "offline" && type !== "webinar") {
      setDuration(40);
    }
  }, [type, startTime, duration]);
  const [categories, setCategories] = useState<CategoryType[]>([])

  const getCategories = () => {
    apiService.get('category/all').then(function (response) {
      // console.log(response.data)
      setCategories(response.data.category)
    }).catch(error => {
      console.log(error)
    })
  }

  const getUser = () => {
    apiService.get(`user/profile/${user.id}`)
      .then(function (response) {
        setUser(response.data.user)
      })
  }

  const getLiveCourses = () => {
    apiService.get('courses/live')
      .then(function (response) {
        setLiveCourses(response.data)
      }).catch(e => {
        console.log(e);

      })
  }
  useEffect(() => {
    getStudents()
    getCategories()
    getLiveCourses()
    getUser()

  }, [])

  const formattedOptions = students.map((option: UserType) => ({ value: option.studentId, label: option.fullname }));


  return (
    open && <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 overflow-y-auto rounded-md right-0 lg:w-[70%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          {course === null ? <p className='font-medium'>Add Event</p> : <p className='font-medium'>Edit Event</p>
          }
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        {contextHolder}
        <div className='lg:flex justify-between lg:mx-12 mx-4 my-4'>
          <div className='lg:w-[48%]'>
            <div>
              <p className='text-sm font-medium my-1'>Event Image</p>
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
                  <p> Add course</p>
                </button>}
            </div>
            <div className='flex my-1'>
            </div>
            <input
              onChange={handleImage}
              type="file"
              name="identification"
              accept='video/*,image/*'
              ref={uploadRef}
              hidden
              multiple={false}
            />

          </div>
          <div className='lg:w-[48%]'>
            <div className='border-b font-medium flex justify-between border-[#1E1E1E12]'>
              <div className={active === 0 ? 'border-b border-primary p-2' : 'p-2 cursor-pointer'}>
                <p onClick={() => setActive(0)}>Event Descriptions</p>
              </div>
              <div className={active === 1 ? 'border-b border-primary p-2' : 'p-2 cursor-pointer'}>
                <p onClick={() => setActive(1)}>Event Details</p>
              </div>
              <div className={active === 2 ? 'border-b border-primary p-2' : 'p-2 cursor-pointer'}>
                <p onClick={() => setActive(2)}>Fee</p>
              </div>
            </div>
            <div>
              {(() => {
                switch (active) {
                  case 0:
                    return <div>
                      <div className='flex justify-between'>
                        <div className='my-1 w-[48%]'>
                          <label className='text-sm font-medium my-1'>Event Type</label>
                          <select onChange={e => setMode(e.target.value)} value={mode} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                            <option value="conference">Conference</option>
                            <option value="seminar">Seminar</option>
                            <option value="workshop">Workshop</option>
                          </select>
                        </div>
                        <div className='my-1 w-[48%]'>
                          <label className='text-sm font-medium my-1'>Event Mode</label>
                          <select onChange={handleTypeChange} value={type} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="webinar">Webinar</option>

                          </select>
                        </div>
                      </div>
                      <div className='flex justify-between my-1'>
                        <div className='w-full'>
                          <label className='text-sm font-medium my-1'>Event Category</label>
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
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Available Seats</label>
                        <input onChange={e => setTarget(e.target.value)} value={target} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                      </div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Event title</label>
                        <input onChange={e => setTitle(e.target.value)} value={title} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                      </div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>About event</label>
                        <textarea onChange={e => setAbout(e.target.value)} value={about} className='border rounded-md border-[#1E1E1ED9] w-full h-32 p-2 bg-transparent'></textarea>
                      </div>
                    </div>
                  case 1:
                    return <div>
                      <div className='flex justify-between'>
                        <div className='w-[48%]'>
                          <label className='text-sm font-medium my-1'>Event Duration</label>
                          <input defaultChecked onChange={e => { e.preventDefault(); console.log(e.target.value); setDuration(parseInt(e.target.value)) }} max={type === 'online' ? parseFloat(process.env.NEXT_PUBLIC_MEETING_DURATION as string) : undefined} value={duration} type="number" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                        </div>
                        <div className='w-[48%]'>
                          <label className='text-sm font-medium my-1'> *</label>
                          <select onChange={(e) => setTimeframe(e.target.value)} value={timeframe} className='border rounded-md w-full border-[#1E1E1ED9]  p-2  py-2.5 bg-transparent'>
                            <option value="minutes">Minutes</option>
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                            <option value="months">Months</option>
                          </select>
                        </div>
                      </div>

                      {type === 'online' ? <>
                        <SelectCourseDate setEndDate={setEndDate} setConflict={setConflict} startDate={startDate} duration={duration} startTime={startTime} endTime={endTime} setStartDate={setStartDate} setStartTime={setStartTime} setEndTime={setEndTime} courses={liveCourses} />

                      </> : null}
                      {type === 'offline' && <>
                        <div className='flex justify-between my-1'>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Start date</label>
                            <input onChange={e => setStartDate(e.target.value)} value={startDate} type="date" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>End date</label>
                            <input onChange={e => setEndDate(e.target.value)} value={endDate} type="date" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                        </div>
                        <div className='flex justify-between my-1'>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Start time</label>
                            <input onChange={e => setStartTime(e.target.value)} value={startTime} type="time" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>End time</label>
                            <input onChange={e => setEndTime(e.target.value)} value={endTime} type="time" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                        </div>
                        <div className='flex justify-between my-1'>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Event Location</label>
                            <input placeholder='Place where this event will hold' onChange={e => setLocation(e.target.value)} value={location} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Event Room</label>
                            <input placeholder='Room No.' onChange={e => setRoom(e.target.value)} value={room} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                        </div>
                      </>}

                      {
                        type === 'webinar' && <div className=' mt-4'>
                          {/* <div className='my-1'>
                            <label className='text-sm font-medium my-1'>Sub Title</label>
                            <input onChange={e => handleInputChange(index, 'title', e.target.value)} value={video.title} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div> */}
                          <input
                            onChange={handleVideoChange}
                            type="file"
                            name="identification"
                            accept="video/*"
                            id={`video`}
                            hidden
                            multiple={false}
                          />
                          <label className='flex cursor-pointer h-full   ' htmlFor={`video`} >

                            {
                              video.videoUrl === "" ? <div className='w-fit flex items-center bg-primary hover:bg-opacity-70 duration-300 rounded-md px-5 py-2 gap-2 '>
                                <span className=' text-[20px]'><Video /></span>
                                <span className='text-sm'>Add your Recorded webinar </span>
                              </div> : <div className='relative w-full group border overflow-hidden border-[#d9d9d9]  h-full'>

                                <video key={video.videoUrl} className={`rounded-lg w-full video`} width="250" >
                                  <source src={video.videoUrl} type="video/mp4" />
                                </video>
                                <div className='absolute inset-0 bg-[rgb(0,0,0,0.3)] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100 flex justify-center gap-2 items-center'>
                                  <button className='text-primary text-[70px] transform scale-75 group-hover:scale-100 transition-transform duration-300' onClick={(e) => { e.stopPropagation(); e.preventDefault(); handlePlayClick() }}>
                                    {play ? <Pause /> : <Play />}
                                  </button>

                                </div>
                                <div className='absolute  bottom-1 w-full transform translate-y-full  group-hover:translate-y-0 transition-transform duration-300'>
                                  <div className='px-3 py-1.5 flex items-center gap-3'>
                                    <label title='Change Video' htmlFor={`video`} className='cursor-pointer text-white hover:text-gray text-[18px]'><Replace /></label>
                                    <button className='text-white hover:text-red-400 text-[18px]' title='remove video' onClick={(e) => { e.stopPropagation(); e.preventDefault(); setVideo(layout) }}><Bin /></button>
                                  </div>
                                </div>

                              </div>
                            }


                            {/* <p className='text-sm'>{video.videoUrl === "" ?  : video.videoUrl.slice(0, 20)}</p> */}
                          </label>

                          <div className='flex flex-col mt-6 gap-2'>
                            <p className='font-medium'>Webinar Schedule</p>
                            <ScheduledCourse conflict={conflict} allowedEdit={true} setConflict={setConflict} duration={duration} courses={liveCourses} days={days} endDate={endDate} setDays={setDays} setEndDate={setEndDate} startDate={startDate} setStartDate={setStartDate} />
                          </div>



                        </div>
                      }
                    </div>
                  case 2:
                    return <div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Event Fee</label>
                        <input onChange={e => setFee(parseInt(e.target.value))} value={fee} type="number" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                        <p className='text-xs'>Set event fee to 0 for a free course</p>
                      </div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Who attends this event for free (Scholarship)</label>
                        <Select
                          isMulti
                          options={formattedOptions}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={(e: any) => { setScholarship(e) }}
                        />
                      </div>
                      <div className='my-5'>
                        <label className='text-sm font-medium my-1'>Show striked out original cost fee</label>
                        <input type='number' onChange={e => setStriked(parseInt(e.target.value))} value={striked} className='border rounded-md border-[#1E1E1ED9] w-full h-20 p-2 bg-transparent' />
                      </div>
                    </div>
                  default:
                    return null
                }
              })()}

              {
                (type === `webinar` && uploading) && <div className='flex  flex-col mb-5 '>
                  <h3>Video Upload</h3>
                  <div className='mt-3'>
                    <div className='w-full bg-gray p-0.5 rounded-md'>
                      <div style={{ width: `${uploadProgress}%` }} className='bg-primary h-2 rounded-md'></div>
                    </div>

                  </div>
                </div>
              }
              <div>
                <p className='text-sm my-4'>By uploading you agree that this event is a product of you
                  and not being forged<input className='ml-2' type="checkbox" /></p>
                <div className='flex'>
                  {course === null ? active === 2 ? <button onClick={() => add()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>{loading ? <Spin /> : "Create Event"}</button> : <button onClick={() => setActive(active + 1)} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>Next</button> : active === 2 ? <button onClick={() => edit()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>{loading ? <Spin /> : "Edit Event"}</button> : <button onClick={() => setActive(active + 1)} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>Next</button>}
                  <button onClick={() => handleClick()} className='mx-4'>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvents;
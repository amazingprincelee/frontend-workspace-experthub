import apiService from '@/utils/apiService';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

const UploadVideo = ({ id }: { id: string }) => {
  const videoRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  let layout = {
    title: "",
    videoUrl: ""
  }
  const [videos, setVideos] = useState([layout])
  const router = useRouter()

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>, index: any) => {

    const files = e.target.files

    const reader = new FileReader()
    if (files && files.length > 0) {

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          handleInputChange(index, 'videoUrl', reader.result as string)
        }
      }
    }
  }

  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedObjects = [...videos];
    updatedObjects[index] = { ...updatedObjects[index], [field]: value };
    setVideos(updatedObjects);
  };

  const uploadVid = async () => {
    setLoading(true)
    await apiService.post(`courses/upload/${id}`, {
      videos
    })
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        window.location.reload();
      }).catch(error => {
        console.log(error)
        setLoading(false)
        setLoading(false)
      })
  }

  const deleteLayout = (index: any) => {
    console.log(videos.length)
    if (videos.length > 1) {
      // let array = videos
      // array.splice(index, 1)
      setVideos(videos.splice(index))
      // console.log(videos)
    }

  }

  return (
    <div>
      <p className='py-2 text-base font-bold'>Upload Additional Videos</p>
      {
        videos.map((video, index) => <div key={index}>
          <div className='my-1'>
            <label className='text-sm font-medium my-1'>Sub Title</label>
            <input onChange={e => handleInputChange(index, 'title', e.target.value)} value={video.title} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
          </div>
          <input
            onChange={(e) => handleVideo(e, index)}
            type="file"
            name="identification"
            accept="/*"
            ref={videoRef}
            hidden
            multiple={false}
          />
          <div className='flex cursor-pointer' onClick={() => videoRef.current?.click()}>
            <img className='w-5 h-5 my-auto mr-2' src="/images/icons/charm_camera-video.svg" alt="" />
            <p className='text-sm'>{video.videoUrl === "" ? "Add Video to Sub-title" : video.videoUrl.slice(0, 20)}</p>
          </div>
          {/* <button className='px-3 my-4 text-sm' onClick={() => deleteLayout(index)}>Delete </button> */}
        </div>)
      }
      <button className='px-3 my-4 font-medium' onClick={() => setVideos([...videos, layout])}>Add </button>

      <div><button onClick={() => uploadVid()} className='px-6 p-2 rounded-md bg-primary'>{loading ? 'loading...' : "Upload"}</button></div>
    </div>
  );
};

export default UploadVideo;
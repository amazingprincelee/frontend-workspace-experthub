import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import { useAuth } from "@/context/AuthContext";
import apiService from '@/utils/apiService';
import { useRouter } from "next/navigation";

const dayMapping = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6,
};

const AppointmentModal = ({ open, handleClick, to, data }: { open: boolean, handleClick: any, to?: any, data?: any }) => {
  const [steps, setSteps] = useState(0)
  const [location, setLocation] = useState(data?.location || '')
  const [room, setRoom] = useState(data?.room || '')
  const [mode, setMode] = useState(data?.mode || "")
  const [category, setCategory] = useState(data?.category || "")
  const [reason, setReason] = useState(data?.reason || "")
  const [date, setDate] = useState(data?.date || "")
  const [time, setTime] = useState(data?.time || "")
  const [api, contextHolder] = notification.useNotification();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false)
  const [availability, setAvailability] = useState<any>()
  const [phone, setPhone] = useState("")
  const router = useRouter();

  useEffect(() => {
    setLocation(data?.location)
    setRoom(data?.room)
    setMode(data?.mode)
    setCategory(data?.category)
    setReason(data?.reason)
    setDate(data?.date)
    setTime(data?.time)
  }, [data])

  const getTo = () => {
    apiService.get(`/appointment/availability/${to}`).then(function (response) {
      // console.log(response.data)
      setAvailability(response.data)
      setRoom(response.data.room)
      setLocation(response.data.location)
    }).catch(error => {
      console.log(error)
    })
  }

  const createAppointment = () => {
    setLoading(true)
    apiService.post('/appointment/new', {
      category,
      room,
      date,
      time,
      phone,
      reason,
      location,
      mode,
      from: user.id,
      to
    }).then(function (response) {
      api.open({
        message: "Appointment succesfully booked!",
      });
      console.log(response.data)
      handleClick()
      router.push('/applicant/appointment')
      setLoading(false)
    }).catch(error => {
      console.log(error)
      setLoading(false)
      api.open({
        message: error.response.data.message
      });
    })
  }

  const handleDateChange = (e: any) => {
    const inputDate = e.target.value;
    const selectedDay = new Date(inputDate).getUTCDay(); // 0 = Sunday, 6 = Saturday

    let isDayAllowed = true;

    availability.days.forEach((single: any, index: number) => {
      if (single.checked) {
        // Days from Monday (index 1) to Friday (index 5)
        if (index >= 1 && index <= 5 && selectedDay === index) {
          isDayAllowed = false;
        }
      }
    });

    if (!isDayAllowed) {
      alert('Selected date is not allowed. Please choose another day.');
      setDate(''); // Reset if invalid date
    } else {
      setDate(inputDate); // Set valid date
    }
  };

  useEffect(() => {
    if (to) {
      getTo()
    }
  }, [])

  const editAppointment = () => {
    setLoading(true)
    apiService.put(`/appointment/edit-appointment/${data._id}`, {
      category,
      room,
      date,
      time,
      reason,
      location,
      phone,
      mode,
      from: user.id,
      to
    }).then(function (response) {
      api.open({
        message: "Appointment succesfully Edited!",
      });
      console.log(response.data)
      handleClick()
      setLoading(false)
    }).catch(error => {
      console.log(error)
      setLoading(false)
      api.open({
        message: error.response.data.message
      });
    })
  }

  return (
    open ? <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 overflow-y-auto rounded-md right-0 lg:w-[70%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <div className='flex lg:w-[30%] w-[80%] justify-between mx-auto'>
            <p onClick={() => setSteps(0)} className={steps === 0 ? 'font-medium border-b border-[#DC9F08] pb-2' : 'font-medium cursor-pointer'}>Appointment</p>
            <p onClick={() => setSteps(1)} className={steps === 1 ? 'font-medium border-b border-[#DC9F08] pb-2' : 'font-medium cursor-pointer'}>Available Time</p>
            {/* <p onClick={() => setSteps(2)} className={steps === 2 ? 'font-medium border-b border-[#DC9F08] pb-2' : 'font-medium cursor-pointer'}>Location</p> */}
          </div>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:w-1/2 w-[90%] mx-auto mt-10'>
          {contextHolder}
          {(() => {
            switch (steps) {
              case 0:
                return <div>
                  <div className='my-2'>
                    <div className='mb-2'>
                      <label htmlFor="">Appointment Mode</label>
                    </div>
                    <select onChange={(e) => setMode(e.target.value)} value={mode} name="" className='w-full border capitalize rounded-md p-3 bg-transparent'>
                      {/* <option value="All">All</option> */}
                      {availability?.mode.length > 1 ? <>
                        <option className='hidden' value="">Select Mode</option>
                        {availability?.mode.map((single: any, index: any) => single.checked && <option key={index} className='capitalize' value={single.name}>{single.name}</option>)}
                      </> : <>
                        <option className='hidden' value="">Select Mode</option>
                        <option value="online">Online</option>
                        <option value="in person">In Person</option>
                        <option value="phone">Phone</option>
                      </>}
                    </select>
                  </div>
                  {mode === 'phone' && <>
                    <label htmlFor="">Enter Your Phone Number</label>
                    <input className='w-full border capitalize rounded-md p-3 bg-transparent' value={phone} onChange={(e) => setPhone(e.target.value)} type="number" />
                  </>}
                  <div className='my-2'>
                    <div className='mb-2'>
                      <label htmlFor="">Appointment  Category</label>
                    </div>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} name="" className=' w-full border rounded-md p-3 bg-transparent'>
                      <option className='hidden' value="">Select Category</option>
                      <option value="Mentorhsip">Mentorhsip</option>
                      <option value="Classes">Classes</option>
                      <option value="Enquiries">Enquiries</option>
                    </select>
                  </div>
                  <div className='my-2'>
                    <div className='mb-2'>
                      <label htmlFor="">Reason for Appointment</label>
                    </div>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} className='h-20 w-full border rounded-md p-3 bg-transparent'></textarea>
                  </div>
                  <div className='flex justify-evenly w-44 mx-auto mt-6'>
                    <button onClick={() => setSteps(1)} className='bg-[#FDC332] p-3 rounded-md px-6'>Next</button>
                    <button>Cancel</button>
                  </div>
                </div>
              case 1:
                return <div>
                  {/* <p>Your Business Hours will prevent students and mentees from booking appointments with you outside these hours.</p> */}
                  <p className='font-bold my-4'>Select your available time for appointment</p>
                  <div className='flex justify-between'>
                    <div className='w-[49%]'>
                      <div className='mb-3'>
                        <label htmlFor="Date">Date</label>
                      </div>
                      <input id="customDate" onChange={(e) => availability.days.length > 1 ? handleDateChange(e) : setDate(e.target.value)} value={date} className='w-full border rounded-md p-3 bg-transparent' type="date" />
                    </div>
                    <div className='w-[49%]'>
                      <div className='mb-3'>
                        <label htmlFor="">Time</label>
                      </div>
                      <input value={time} onChange={(e) => setTime(e.target.value)} className='w-full border rounded-md p-3 bg-transparent' type="time" />
                    </div>
                  </div>
                  <div className='flex justify-evenly mx-auto mt-6'>
                    {data ? <button onClick={() => editAppointment()} className='bg-[#FDC332] p-3 rounded-md px-6'>{loading ? 'loading...' : 'Edit  Appointment'}</button>
                      : <button onClick={() => createAppointment()} className='bg-[#FDC332] p-3 rounded-md px-6'>{loading ? 'loading...' : 'Create  Appointment'}</button>
                    }
                    <button>Cancel</button>
                  </div>
                </div>
              case 2:
                return <div>
                  <p>Appointment Location</p>
                  <div className='flex mt-4 justify-between'>
                    <div className='w-[49%]'>
                      <input onChange={(e) => setLocation(e.target.value)} value={location} className='w-full border rounded-md p-3 bg-transparent' placeholder='Place where this Event will be held' type="text" />
                    </div>
                    <div className='w-[49%]'>
                      <input value={room} onChange={(e) => setRoom(e.target.value)} className='w-full border rounded-md p-3 bg-transparent' placeholder='Room No.' type="text" />
                    </div>
                  </div>
                  <div className='flex justify-evenly mx-auto mt-6'>
                    <button
                      onClick={() => (data ? editAppointment() : createAppointment())}
                      className="bg-[#FDC332] p-3 rounded-md px-6"
                    >
                      {loading ? 'Loading...' : data ? 'Edit Appointment' : 'Create Appointment'}
                    </button>
                    <button>Cancel</button>
                  </div>
                </div>
            }
          })()}
        </div>
      </div>
    </div> : null
  );
}

export default AppointmentModal;
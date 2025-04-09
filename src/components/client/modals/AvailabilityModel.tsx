import React, { useState } from 'react';
import { notification } from 'antd';
import { useAppSelector } from '@/store/hooks';
import apiService from '@/utils/apiService';

const Availability = ({ open, handleClick }: { open: boolean, handleClick: any }) => {
  const [steps, setSteps] = useState(0)
  const [api, contextHolder] = notification.useNotification();
  const user = useAppSelector((state) => state.value);
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState('')
  const [room, setRoom] = useState('')

  const [mode, setMode] = useState([
    {
      name: 'online',
      checked: false
    },
    {
      name: 'in person',
      checked: false
    },
    {
      name: 'phone',
      checked: false
    }
  ])
  const [days, setDays] = useState([{
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
  }])

  const updateAvailability = () => {
    setLoading(true)
    apiService.put(`/appointment/availability/${user.id}`, {
      days,
      mode,
      room,
      location
    }).then(function (response) {
      api.open({
        message: "Availability succesfully saved!",
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
  const handleModeChange = (index: number, field: string, value: string | number | boolean) => {
    const updatedObjects = [...mode];
    updatedObjects[index] = { ...updatedObjects[index], [field]: value };
    setMode(updatedObjects);
  };

  const handleDaysInputChange = (index: number, updates: Partial<typeof days[0]>) => {
    setDays(prevDays =>
      prevDays.map((day, i) => (i === index ? { ...day, ...updates } : day))
    );
  };

  const handleChecked = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    handleDaysInputChange(index, {
      checked: isChecked,
      startTime: isChecked ? '09:00:00' : '',
      endTime: isChecked ? '17:00:00' : '',
    });
  };


  return (
    open ? <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 overflow-y-auto rounded-md right-0 lg:w-[70%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <div className='flex lg:w-[40%] w-[80%] justify-between'>
            <p onClick={() => setSteps(0)} className={steps === 0 ? 'font-medium border-b border-[#DC9F08] pb-2' : 'font-medium cursor-pointer'}>Mode of Appointment</p>
            <p onClick={() => setSteps(1)} className={steps === 1 ? 'font-medium border-b border-[#DC9F08] pb-2' : 'font-medium cursor-pointer'}>Available Time</p>
          </div>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:w-1/2 w-[90%] mx-auto mt-10'>
          {contextHolder}
          {(() => {
            switch (steps) {
              case 0:
                return <div>
                  <p>Setting your mode of Appointment will enable your client reach
                    out to you either via online, by phone call or your address</p>
                  <div className='mt-8'>
                    {/* <p>How many hours can you commit to your training a week?</p> */}
                    {mode.map((single, index) => <div className='flex my-3'>
                      <input onChange={() => handleModeChange(index, 'checked', !single.checked)} type="checkbox" checked={single.checked} />
                      <p className='ml-2 capitalize'>{single.name}</p>
                    </div>)}
                    {mode[1].checked && <>
                      <p>Appointment Location</p>
                      <div className='flex mt-4 justify-between'>
                        <div className='w-[49%]'>
                          <input onChange={(e) => setLocation(e.target.value)} value={location} className='w-full border rounded-md p-3 bg-transparent' placeholder='Place where this Event will be held' type="text" />
                        </div>
                        <div className='w-[49%]'>
                          <input value={room} onChange={(e) => setRoom(e.target.value)} className='w-full border rounded-md p-3 bg-transparent' placeholder='Room No.' type="text" />
                        </div>
                      </div>
                    </>}

                    {/* <div className='flex my-3'>
                      <input type="checkbox" />
                      <p className='ml-2'>In Person</p>
                    </div>
                    <div className='flex my-3'>
                      <input type="checkbox" />
                      <p className='ml-2'>Phone</p>
                    </div> */}
                  </div>
                  <div className='flex justify-evenly w-44 mx-auto mt-6'>
                    <button onClick={() => setSteps(1)} className='bg-[#FDC332] p-3 rounded-md px-6'>Next</button>
                    <button onClick={() => handleClick()}>Cancel</button>
                  </div>
                </div>
              case 1:
                return <div>
                  <p>Select Appointment day and time</p>
                  {days.map((day: { checked: boolean | undefined; day: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; startTime: string | number | readonly string[] | undefined; endTime: string | number | readonly string[] | undefined; }, index: any) => <div key={index} className='flex justify-between my-1'>
                    <input onChange={e => {
                      handleChecked(index, e)
                    }} checked={day.checked} type="checkbox" />
                    <p className='w-24 my-auto'>{day.day}</p>
                    <input
                      value={day.startTime}
                      onChange={e => handleDaysInputChange(index, { startTime: e.target.value })}
                      className={`py-1 px-2 rounded-sm ${day.checked && !day.startTime ? 'border border-[#FF0000]' : ''}`}
                      type="time"
                    />
                    <p className="my-auto">-</p>
                    <input
                      value={day.endTime}
                      onChange={e => handleDaysInputChange(index, { endTime: e.target.value })}
                      className={`py-1 px-2 rounded-sm ${day.checked && !day.endTime ? 'border border-[#FF0000]' : ''}`}
                      type="time"
                    />
                  </div>)}
                  <div className='flex justify-evenly mx-auto mt-6'>
                    <button onClick={() => updateAvailability()} className='bg-[#FDC332] p-3 rounded-md px-6'>{loading ? 'loading...' : 'Save'}</button>
                    <button onClick={() => handleClick()}>Cancel</button>
                  </div>
                </div>
            }
          })()}
        </div>
      </div>
    </div> : null
  );
}

export default Availability;
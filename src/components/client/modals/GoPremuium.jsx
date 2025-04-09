
'use client'

import apiService from '@/utils/apiService'
import { Fade, Slide } from '@mui/material'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsX } from 'react-icons/bs'

export default function GoPremuim({ show, setShow }) {
  const [premiumUsers, setPremiumUsers] = useState([])


  const getUsers = () => {
    apiService.get(`user/instructors`)
      .then(function (response) {
        console.log(response.data.instructors, "hmm na them o");

        setPremiumUsers(response.data.instructors.filter(user => user.premiumPlan === "basic"))
      })
  }

  useEffect(() => {
    getUsers()
  }, [])
  return (
    <Fade mountOnEnter unmountOnExit in={show} timeout={600} >
      <div className='fixed z-[100] flex items-center justify-center w-full h-screen  top-0 left-0 bg-black bg-opacity-75'>
        <Slide in={show} timeout={500} mountOnEnter unmountOnExit>
          <div className='bg-white rounded-lg w-[400px] relative '>
            <h2 className='font-semibold text-center border-b py-2 text-[20px] flex items-center justify-center '>Go Premium </h2>
            <button clas onClick={() => setShow(false)} className='absolute right-2 top-3 text-[24px]'><BsX /></button>

            <div className='py-4 px-3 flex flex-col gap-2'>
              <p className='text-[20px] text-center leading-6  px-4'>You need our premium service to achieve your goal</p>
              {
                premiumUsers.length !== 0 && <div className='flex items-center justify-center w-full'>{
                  premiumUsers.filter(user => user.profilePicture).slice(0, 3).map(user => <img alt={user.fullname} src={user.profilePicture} className='-mr-5 w-[40px] h-[40px] rounded-full object-cover border border-primary' />)
                }

                  <div className='text-[15px] ml-6'> <span className=' text-nowrap overflow-hidden text-ellipsis max-w-[100px] capitalize'>{
                    premiumUsers.filter(user => user.fullname)[0].fullname
                  }</span> and {premiumUsers.length - 1} others are using premium</div>
                </div>

              }
              <div>

              </div>
              <p className='text-[20px] text-center leading-6'>Activate your 5-day free trial, No Contracts. You can cancel anytime with one click if the premium service isn&apos;t right for you</p>
              <Link href={'/tutor/plans'} className='px-5 py-3 bg-primary rounded-md  text-center font-semibold text-[20px] shadow-md'>Start Your Free Trial</Link>
            </div>
          </div>
        </Slide>
      </div>
    </Fade>
  )
}

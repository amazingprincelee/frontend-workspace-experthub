import { useAppSelector } from '@/store/hooks';
import apiService from '@/utils/apiService';
import { isActionChecked } from '@/utils/checkPrivilege';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const AssesmentCard = ({ assesment, getAssesment }: { assesment: any, getAssesment?: any }) => {
  const pathname = usePathname()
  const user = useAppSelector((state) => state.value);
  const router = useRouter()

  const deleteAssesment = () => {
    apiService.delete(`assessment/delete/${assesment._id}`)
      .then(function (response) {
        console.log(response)
        getAssesment()
      })
  }

  return (
    <div className='border lg:w-[48%] my-4 border-[#1E1E1E59] p-4 rounded-md flex justify-between'>
      <div className='w-80'>
        <img className='rounded-md w-full h-28 object-cover shadow-[26px_0px_32.099998474121094px_0px_#FDC3324D]' src={assesment.image} alt="" />
      </div>
      <div className='pl-10 w-full'>
        <h4 className='text-xl my-2 font-medium'>{assesment.title}</h4>
        {/* <p className='text-xs my-3'>Gain the basic skills user
          needs, study the basic
          experience</p> */}
        {pathname.includes('applicant') ? <Link href={`test/${assesment._id}?type=${assesment.type}`}>
          <button className='p-2 px-6 rounded-sm bg-primary'>View</button>
        </Link> : <div className='flex justify-between'>
          {/* <Link href={`assesment/new?page=${assesment._id}`}> */}
          <button onClick={() => {
            if (isActionChecked("Edit Assessment", user.privileges)) {
              router.push(`assesment/new?page=${assesment._id}`);
            }
          }} className='p-2 rounded-sm bg-primary'>Edit</button>
          {/* </Link> */}
          <button onClick={() => {
            if (isActionChecked("Delete Assessment", user.privileges)) {
              deleteAssesment()
            }
          }} className='p-2 rounded-sm bg-red-500 text-white'>Delete</button>
          <button onClick={() => {
            if (isActionChecked("View Assessment", user.privileges)) {
              router.push(`assesment/view?page=${assesment._id}`);
            }
          }} className='p-2 rounded-sm bg-primary'>View</button>
        </div>}
      </div>
    </div>
  );
};

export default AssesmentCard;
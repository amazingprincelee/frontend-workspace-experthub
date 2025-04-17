import { useAuth } from "@/context/AuthContext";
import { WorkspaceType } from '@/types/WorkspaceType';
import React from 'react';
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  WhatsappIcon,
  LinkedinIcon
} from 'react-share'

const ShareModal = ({ open, handleClick, workspace }: { open: boolean, handleClick: any, workspace: WorkspaceType }) => {
  const { user } = useAuth();

  return (
    open && <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[50%] w-[90%] h-[55%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <p className='font-medium'>Share Course</p>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='lg:p-10 p-4'>
          <p>Share course to friends or family to make purchase for you!</p>
          <div className='my-2'>
            <FacebookShareButton url={`https://trainings.experthubllc.com/${workspace._id}?user=${user.id}`}>
              <button className='flex bg-transparent'>
                <FacebookIcon round size={26} />
                <p className='ml-3'>Share on Facebook</p>
              </button>
            </FacebookShareButton>
          </div>

          <div className='my-2'>
            <WhatsappShareButton url={`https://trainings.experthubllc.com/${workspace._id}?user=${user.id}`}>
              <button className='flex bg-transparent'>
                <WhatsappIcon round size={26} />
                <p className='ml-3'>Share on WhatsApp</p>
              </button>
            </WhatsappShareButton>
          </div>

          <div className='my-2'>
            <LinkedinShareButton url={`https://trainings.experthubllc.com/${workspace._id}?user=${user.id}`}>
              <button className='flex bg-transparent'>
                <LinkedinIcon round size={26} />
                <p className='ml-3'>Share on LinkedIn</p>
              </button>
            </LinkedinShareButton>
          </div>

          <div className='my-2'>
            <EmailShareButton url={`https://trainings.experthubllc.com/${workspace._id}?user=${user.id}`}>
              <button className='flex bg-transparent'>
                <EmailIcon round size={26} /> <p className='ml-3'> Share via Email</p>
              </button>
            </EmailShareButton>
          </div>
          <div>
            <div className='flex justify-end'>
              {/* <button className='p-2 bg-primary font-medium w-40 rounded-md text-sm'> {loading ? "loading..." : "Assign"}</button> */}
              <button onClick={() => handleClick()} className='mx-4'>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
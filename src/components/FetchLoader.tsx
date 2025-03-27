import React from 'react'

export default function Loader() {
    return (
        <div className='flex fixed top-0 left-0 items-center z-[9999999] bg-white justify-center h-screen w-full'>
            <div className='inline-flex justify-center items-center flex-col gap-3'>
                <span className="loader2"></span>
                <span className="loader3 text-black">Fetching Data</span>
            </div>

        </div>
    )
}
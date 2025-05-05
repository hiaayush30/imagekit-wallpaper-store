import UploadFile from '@/components/uploadFile'
import React from 'react'

function page() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <div className='bg-white text-slate-800 p-5 rounded-lg'>
        <UploadFile />
      </div>
    </div>
  )
}

export default page

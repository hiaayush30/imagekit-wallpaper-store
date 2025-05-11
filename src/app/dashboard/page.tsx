"use client"
import RazorpayPayment from '@/components/RazorpayPayment'
import UploadFile from '@/components/uploadFile'
import React from 'react'

function page() {
  return (
    <div>
      Dashboard page
      <div className='flex items-center justify-center py-10 text-stone-800'>
        <UploadFile />
      </div>
      <div>
        <RazorpayPayment/>
      </div>
    </div>
  )
}

export default page

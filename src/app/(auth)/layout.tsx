import Link from 'next/link'
import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
    return (
        <div>
            <div className='absolute top-0 inset-x-0 bg-orange-600 p-5'>
              <Link href={"/"} className='text-xl font-semibold'>Imagekit-Store</Link>
            </div>
            {children}
        </div>
    )
}

export default layout

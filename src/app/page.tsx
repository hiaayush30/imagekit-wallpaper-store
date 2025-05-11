"use client"

import ImageGallery from '@/components/ImageGallary'
import { apiClient } from '@/lib/api-client'
import { IProduct } from '@/models/product.model'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

function Landing() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        console.log(data)
        setProducts(data);
      } catch (error) {
        toast(error?.message as string)
      }
    }
    fetchProducts();
  },[])

  return (
    <div>
      <ImageGallery products={products}/>
    </div>
  )
}

export default Landing

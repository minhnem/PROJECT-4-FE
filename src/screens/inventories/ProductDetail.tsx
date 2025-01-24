import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const ProductDetail = () => {

  const [isLoading, setIsLoading] = useState(false)

  const [serchParams] = useSearchParams()

  return (
    <div>
      ProductDetail
    </div>
  )
}

export default ProductDetail

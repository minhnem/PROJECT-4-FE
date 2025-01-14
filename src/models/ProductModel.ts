export interface ProductModel {
    title: string
    slug: string
    description: string
    categories: string[]
    supplier: string
    images: string[]
    subProduct: SubProductModel[]
    createdAt: string
    updatedAt: string
    isDeleted: boolean
    _id: string
    __v: number
}

export interface SubProductModel {
  size: string
  color: string
  price: number
  qty: number
  images: string[]
  productId: string
  createdAt: string
  updatedAt: string
  _id: string
  __v: number
}
export interface SupplierModel {
    index: number
    name: string
    slug: string
    product: string
    categories: any[]
    price: number
    email: string
    contact: string
    isTaking: number
    photoUrl: string
    createdAt: string
    updatedAt: string
    _id: string
  }

export interface SupplierOption {
  label: string,
  value: string
}
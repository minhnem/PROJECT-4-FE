export interface Categories {
    label: string 
    value: string 
}

export interface TreeData {
    label: string 
    value: string
    children?: Categories[]
}

export interface CategoryModel {
    _id: string
    title: string
    parentId: string
    slug: string
    description: string
    createdAt: string
    updatedAt: string
    __v: number
  }
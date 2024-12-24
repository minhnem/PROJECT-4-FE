export interface Categories {
    label: string 
    value: string 
}

export interface TreeData {
    label: string 
    value: string
    children?: Categories[]
}
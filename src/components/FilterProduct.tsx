import React from 'react'

export interface FilterProductValue {
    color?: string,
    categories?: string,
    size?: string,
    price?: {
        min: number,
        max: number
    }
}

interface Props {
    value: FilterProductValue,
    onFilter: (val: FilterProductValue) => {}
}

const FilterProduct = (props: Props) => {
  return (
    <div>
      fileter
    </div>
  )
}

export default FilterProduct

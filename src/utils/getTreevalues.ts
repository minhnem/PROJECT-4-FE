export const getTreevalues = (datas: any, isGetAllInfo?: boolean) => {
    const values: any[] = []

    const items = datas.filter((element: any) => !element.parentId )
    const newItems = items.map((element: any) => (isGetAllInfo ? {...element, key: element._id} : {label: element.title, value: element._id}))
    newItems.forEach((element: any) => {
        values.push({
            ...element,
            children: changeMenu(datas, isGetAllInfo ? element._id : element.value, isGetAllInfo)
        })
    })
    return values
}

const changeMenu = (datas: any, id: string, isGetAllInfo?: boolean) => {
    const items: any[] = []
    const childrens = datas.filter((element: any) => element.parentId === id)  
    childrens.forEach((element: any) => {
        items.push(isGetAllInfo ? 
            {
                ...element,
                key: element._id,
                children: changeMenu(datas, element._id, isGetAllInfo)
            } : {
            label: element.title,
            value: element._id,
            children: changeMenu(datas, element._id, isGetAllInfo)
        })
    })    
    
    return items
}
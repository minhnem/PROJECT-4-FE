export const formatDate = (date: string) => {
    const item = new Date(date)
    const vietnamTime = new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false,
        timeZone: 'Asia/Ho_Chi_Minh'
    }).format(item)

    return vietnamTime
}
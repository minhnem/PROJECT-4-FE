import { Checkbox, DatePicker, List, message, Modal, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import handleAPI from '../apis/handleAPI'
import { DateTime } from '../utils/dateTime'
import { handleExportExcel } from '../utils/handleExportExcel'

interface Props {
    visible: boolean,
    onClose: () => void,
    api: string,
    name?: string,
}

interface FormItem {
    key: string,
    value: string,
    label: string,
}

const { RangePicker } = DatePicker
const { Title } = Typography

const ModalExportExcel = (props: Props) => {
    const { visible, onClose, api, name } = props

    const [isLoading, setIsLoading] = useState(false)
    const [isGetting, setIsGetting] = useState(false)
    const [form, setForm] = useState<FormItem[]>([])
    const [checkedValues, setCheckedVales] = useState<string[]>([])
    const [selectAll, setSelectAll] = useState<boolean>(false)
    const [date, setDate] = useState({
        start: '',
        end: ''
    })

    useEffect(() => {
        if (visible) {
            getForm()
        }
    }, [visible, api])

    const getForm = async () => {
        const url = `/${api}/get-form`
        setIsGetting(true)
        try {
            const res = await handleAPI(url)
            res.data && setForm(res.data.formItems)
        } catch (error: any) {
            message.error(error)
        } finally {
            setIsGetting(false)
        }
    }

    const handleCheckedValues = (value: string) => {
        const items = [...checkedValues]
        const index = items.findIndex(element => element === value)
        if (index !== -1) {
            items.splice(index, 1)
        } else {
            items.push(value)
        }
        setCheckedVales(items)

    }

    const handleExport = async () => {
        let url = ''
        if (selectAll === false && date.start && date.end) {
            if (new Date(date.start).getTime() < new Date(date.end).getTime()) {
                url = `/${api}/get-export-data?start=${date.start}&end=${date.end}`
            } else {
                message.error('Thời gian lỗi.')
            }
        } else  {
            url = `/${api}/get-export-data`
        }        

        const data = checkedValues
        if (Object.keys(data).length > 0 || selectAll || ( date.start && date.end )) {
            try {
                setIsLoading(true)
                const res = await handleAPI(url, data, 'post')
                res.data && handleExportExcel(res.data, api)
            } catch (error: any) {
                message.error(error.message)
            } finally {
                setIsLoading(false)
            }
        } else if (selectAll === false && date.start === '' && date.end === '' && Object.keys(data).length <= 0) {
            message.error('Vui lòng lựa chọn thông tin bạn muốn export excel')
        }
    }


    return (
        <Modal
            loading={isGetting}
            open={visible}
            title='Export Excel'
            onClose={onClose}
            onCancel={onClose}
            onOk={handleExport}
            okButtonProps={{
                loading: isLoading
            }}
        >
            <div>
                <Title level={5}>Export all</Title>
                <Checkbox
                    style={{
                        marginTop: '5px',
                        marginBottom: '5px'
                    }}
                    checked={selectAll}
                    onChange={() => {
                        setSelectAll(!selectAll)
                    }}
                >Get all</Checkbox>
            </div>

            <div>
                <Title level={5}>Export file by date</Title>
                <RangePicker
                    style={{
                        marginTop: '5px',
                        marginBottom: '5px'
                    }}
                    onChange={(val: any) => {
                        setDate(val && val[0] && val[1] ? {
                            start: `${DateTime.CalendarDate(val[0])} 00:00:00`,
                            end: `${DateTime.CalendarDate(val[1])} 00:00:00`,
                        } : {
                            start: '',
                            end: ''
                        })

                    }} />
            </div>

            <div>
                <Title level={5}>Export file by selection</Title>
                <List dataSource={form} renderItem={(item) => <List.Item key={item.key}>
                    <Checkbox
                        checked={checkedValues.includes(item.key)}
                        onChange={() => handleCheckedValues(item.value)}
                    >
                        {item.label}
                    </Checkbox>
                </List.Item>} />
            </div>

        </Modal >
    )
}

export default ModalExportExcel

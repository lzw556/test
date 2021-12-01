import {FC, useCallback, useState} from "react";
import TableLayout, {TableProps} from "../../layout/TableLayout";
import {AcknowledgeAlarmRecordRequest, PagingAlarmRecordsRequest, RemoveAlarmRecordRequest} from "../../../apis/alarm";
import {Button, Dropdown, Menu, Popconfirm, Space, Tag} from "antd";
import {ColorDanger, ColorInfo, ColorWarn} from "../../../constants/color";
import {DeviceTypeString} from "../../../types/device_type";
import {GetFieldName} from "../../../constants/field";
import {OperationTranslate} from "../../../constants/rule";
import moment from "moment";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

export interface AlarmRecordTableProps {
    type: "active" | "history"
    start: number
    stop: number
    device: number;
    asset: number;
    levels: number[]
    statuses: number[]
}

const AlarmRecordTable: FC<AlarmRecordTableProps> = ({type, start, stop, device, asset, levels, statuses}) => {
    const [table, setTable] = useState<TableProps>({data: {}, isLoading: false, pagination: true, refreshKey: 0})

    const onChange = useCallback((current: number, size: number) => {
        const filter = {
            device_id: device,
            asset_id: asset,
            levels: levels,
            type: type,
            statuses: statuses,
        }
        PagingAlarmRecordsRequest(current, size, start, stop, filter).then(data => {
            setTable(Object.assign({}, table, {data: data}))
        })
    }, [asset, device, start, stop, levels, type, statuses])

    const onDelete = (id: number) => {
        RemoveAlarmRecordRequest(id).then(_ => onRefresh())
    }

    const onRefresh = () => {
        setTable(Object.assign({}, table, {refreshKey: table.refreshKey + 1}))
    }

    const onAcknowledge = (id: number) => {
        AcknowledgeAlarmRecordRequest(id).then(_ => onRefresh())
    }

    const renderEditMenu = (record: any) => {
        return <Menu onClick={() => onAcknowledge(record.id)}>
            <Menu.Item disabled={record.acknowledged}>标记为已处理</Menu.Item>
        </Menu>
    }

    const columns = [
        {
            title: '报警级别',
            dataIndex: 'level',
            key: 'level',
            render: (level: number) => {
                switch (level) {
                    case 1:
                        return <Tag color={ColorInfo}>提示</Tag>
                    case 2:
                        return <Tag color={ColorWarn}>重要</Tag>
                    case 3:
                        return <Tag color={ColorDanger}>紧急</Tag>
                }
            }
        },
        {
            title: '设备名称',
            dataIndex: 'device',
            key: 'device',
            render: (device: any) => {
                return device.name
            }
        },
        {
            title: '设备类型',
            dataIndex: 'device',
            key: 'type',
            render: (device: any) => {
                return DeviceTypeString(device.typeId)
            }
        },
        {
            title: '报警内容',
            dataIndex: 'rule',
            key: 'rule',
            render: (_: any, record: any) => {
                return `当前【${GetFieldName(record.rule.field)}】值为: 
                ${record.value.toFixed(record.property.precision)}${record.property.unit}\n
                ${OperationTranslate(record.rule.operation)}设定的阈值:${record.rule.threshold.toFixed(record.property.precision)}${record.property.unit}`
            }
        },
        {
            title: '发生时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: number) => {
                return moment(timestamp * 1000).format("YYYY-MM-DD HH:mm:ss")
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => {
                switch (status) {
                    case 1:
                        return <Tag color="blue">已处理</Tag>
                    case 2:
                        return <Tag color="green">已恢复</Tag>
                    default:
                        return <Tag>未处理</Tag>
                }
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 64,
            render: (_: any, record: any) => {
                return <Space>
                    {
                        type === 'active' && <Dropdown overlay={renderEditMenu(record)}>
                            <Button type={"text"} size={"small"} icon={<EditOutlined/>}/>
                        </Dropdown>
                    }
                    <Popconfirm placement="left" title="确认要删除该规则吗?" onConfirm={() => onDelete(record.id)}
                                okText="删除" cancelText="取消">
                        <Button type="text" size="small" icon={<DeleteOutlined/>} danger/>
                    </Popconfirm>
                </Space>
            }
        }
    ]

    const renderColumns = () => {
        if (type === 'active') {
            return [
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name'
                },
                ...columns
            ]
        }
        return columns
    }

    return <TableLayout columns={renderColumns()} isLoading={table.isLoading} pagination={table.pagination}
                        refreshKey={table.refreshKey} data={table.data} onChange={onChange}/>
}

export default AlarmRecordTable
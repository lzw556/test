import {Button, Col, Popconfirm, Row, Select, Space} from "antd";
import TableLayout, {TableProps} from "../../../layout/TableLayout";
import {useCallback, useState} from "react";
import {PagingRuleTemplateRequest, RemoveRuleTemplateRequest} from "../../../../apis/alarm";
import Label from "../../../../components/label";
import DeviceTypeSelect from "../../../../components/deviceTypeSelect";
import {DeviceType, DeviceTypeString} from "../../../../types/device_type";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import HasPermission from "../../../../permission";
import usePermission, {Permission, PermissionType} from "../../../../permission/permission";

const {Option} = Select

const RuleTemplatesPage = () => {
    const [deviceType, setDeviceType] = useState<number>(0)
    const [table, setTable] = useState<TableProps>({data: {}, isLoading: false, pagination: true, refreshKey: 0})

    const onChange = useCallback((current: number, size: number) => {
        onLoading(true)
        PagingRuleTemplateRequest(current, size, deviceType).then(data => {
            onLoading(false)
            setTable({...table, data: data})
        })
    }, [deviceType])

    const onLoading = (isLoading: boolean) => {
        setTable({...table, isLoading})
    }

    const onRefresh = () => {
        setTable({...table, refreshKey: table.refreshKey + 1})
    }

    const onDelete = (id: number) => {
        RemoveRuleTemplateRequest(id).then(_ => onRefresh())
    }

    const columns = [
        {
            title: '模板名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '设备类型',
            dataIndex: 'deviceType',
            key: 'deviceType',
            render: (value: DeviceType) => {
                return DeviceTypeString(value)
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (text: any, record: any) => (
                <Space>
                    <HasPermission value={Permission.AlarmRuleTemplateEdit}>
                        <Button type="text" size="small"
                                href={`#/alarm-management?locale=alarmRules/editAlarmRuleTemplate&templateId=${record.id}`}
                                icon={<EditOutlined/>}/>
                    </HasPermission>
                    <HasPermission value={Permission.AlarmRuleTemplateDelete}>
                        <Popconfirm placement="left" title="确认要删除该模板吗?" onConfirm={() => onDelete(record.id)}
                                    okText="删除" cancelText="取消">
                            <Button type="text" size="small" icon={<DeleteOutlined/>} danger/>
                        </Popconfirm>
                    </HasPermission>
                </Space>
            )
        }
    ]

    return <div>
        <Row justify={"space-between"}>
            <Col span={12}>
                <Space>
                    <Label name={"设备类型"}>
                        <DeviceTypeSelect defaultValue={deviceType} style={{width: "120px"}} bordered={false}
                                          defaultActiveFirstOption={true} sensor={true}
                                          onChange={value => setDeviceType(value)}>
                            <Option key={0} value={0}>所有类型</Option>
                        </DeviceTypeSelect>
                    </Label>
                </Space>
            </Col>
        </Row>
        <br/>
        <Row justify={"space-between"}>
            <Col span={24}>
                <TableLayout isLoading={table.isLoading}
                             emptyText={"报警规则模板列表为空"}
                             permissions={[Permission.AlarmRuleTemplateEdit, Permission.AlarmRuleTemplateDelete]}
                             pagination={table.pagination}
                             refreshKey={table.refreshKey}
                             columns={columns}
                             data={table.data}
                             onChange={onChange}
                />
            </Col>
        </Row>
    </div>
}

export default RuleTemplatesPage
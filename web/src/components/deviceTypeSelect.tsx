import {DeviceType, DeviceTypeString} from "../types/device_type";
import {Select, SelectProps} from "antd";
import {FC} from "react";

const {Option, OptGroup} = Select

export interface DeviceTypeSelectProps extends SelectProps<any> {
    sensor: boolean
}

const DeviceTypeSelect: FC<DeviceTypeSelectProps> = (props) => {
    const {sensor, children} = props

    const render = () => {
        if (sensor) {
            return <Select {...props}>
                {children}
                <Option key={DeviceType.BoltLoosening}
                        value={DeviceType.BoltLoosening}>{DeviceTypeString(DeviceType.BoltLoosening)}</Option>
                <Option key={DeviceType.BoltElongation}
                        value={DeviceType.BoltElongation}>{DeviceTypeString(DeviceType.BoltElongation)}</Option>
                <Option key={DeviceType.NormalTemperatureCorrosion}
                        value={DeviceType.NormalTemperatureCorrosion}>{DeviceTypeString(DeviceType.NormalTemperatureCorrosion)}</Option>
                <Option key={DeviceType.HighTemperatureCorrosion}
                        value={DeviceType.HighTemperatureCorrosion}>{DeviceTypeString(DeviceType.HighTemperatureCorrosion)}</Option>
            </Select>
        } else {
            return <Select {...props}>
                <OptGroup label={"网关"} key={"gateway"}>
                    <Option key={1} value={1}>{DeviceTypeString(DeviceType.Gateway)}</Option>
                </OptGroup>
                <OptGroup label={"中继器"} key={"router"}>
                    <Option key={257} value={257}>{DeviceTypeString(DeviceType.Router)}</Option>
                </OptGroup>
                <OptGroup label={"传感器"} key={"sensor"}>
                    <Option key={DeviceType.BoltLoosening}
                            value={DeviceType.BoltLoosening}>{DeviceTypeString(DeviceType.BoltLoosening)}</Option>
                    <Option key={DeviceType.BoltElongation}
                            value={DeviceType.BoltElongation}>{DeviceTypeString(DeviceType.BoltElongation)}</Option>
                    <Option key={DeviceType.NormalTemperatureCorrosion}
                            value={DeviceType.NormalTemperatureCorrosion}>{DeviceTypeString(DeviceType.NormalTemperatureCorrosion)}</Option>
                    <Option key={DeviceType.HighTemperatureCorrosion}
                            value={DeviceType.HighTemperatureCorrosion}>{DeviceTypeString(DeviceType.HighTemperatureCorrosion)}</Option>
                </OptGroup>
            </Select>
        }
    }
    return render()
}

export default DeviceTypeSelect
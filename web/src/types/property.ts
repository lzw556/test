import {DeviceType} from "./device_type";
import {PropertyData} from "./property_data";

export type Property = {
    id: number
    name: string
    unit: string
    fields: Field[]
    data?: PropertyData
}

export function GetPrimaryProperty(properties: Property[], typeId: DeviceType) {
    switch (typeId) {
        case DeviceType.BoltLoosening:
            return properties.find(p => p.name === "松动角度")
        case DeviceType.BoltElongation:
            return properties.find(p => p.name === "预紧力")
        case DeviceType.HighTemperatureCorrosion:
        case DeviceType.NormalTemperatureCorrosion:
            return properties.find(p => p.name === "厚度")
        case DeviceType.AngleDip:
            return properties.find(p => p.name === "角度")
        case DeviceType.VibrationTemperature3Axis:
            return properties.find(p => p.name === "速度")
        default:
            return undefined
    }
}

export type Field = {
    name: string
}

export const InitializeProperty = {
    id: 0,
    name: "",
    unit: "",
    fields: [],
}
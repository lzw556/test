import * as DeviceTypeOld from '../types/device_type';
import { measurementTypes } from '../views/home/common/constants';

export const category: typeof window.assetCategory = 'wind';

export enum DeviceType {
  Gateway = 1,
  Router = 257,
  BoltLoosening = 131073,
  BoltElongation = 196609,
  BoltElongationMultiChannels = 196611
}

export const devTypes: { val: number; name: string }[] = Object.values(DeviceType)
  .filter((val) => Number.isInteger(val))
  .map((val) => ({
    val: Number(val),
    name: DeviceTypeOld.DeviceType.toString(Number(val))
  }));

export const sensorTypes = [
  DeviceType.BoltLoosening,
  DeviceType.BoltElongation,
  DeviceType.BoltElongationMultiChannels
];

export const site = {
  name: '风电螺栓监测系统'
  //configure logo in 'views\home\summary\windTurbine\icon.tsx'
};

export const assetType = {
  // configure icon in 'views\home\summary\windTurbine\icon.tsx'
  // not apply css but set the size of SVG(thin: 28*28; fat: 24*24)
  id: 101,
  label: '风机',
  parent_id: 0,
  url: '/windturbine',
  secondAsset: {
    id: 102,
    label: '法兰',
    url: '/flange',
    categories: [
      { label: '塔筒', value: 1 },
      { label: '叶根', value: 2 },
      { label: '轮毂-机舱连接', value: 3 },
      { label: '变桨轴承', value: 4 }
    ]
  }
};

export const ownerMeasurementTypes = [
  measurementTypes.loosening_angle,
  measurementTypes.preload,
  measurementTypes.flangePreload
];

export const unusedMenunames: string[] = [];

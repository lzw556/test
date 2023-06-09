import { DeviceType } from '../../types/device_type';
import { Select, SelectProps } from 'antd';
import { FC, useEffect } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import * as AppConfig from '../../config';
import { SENSORS } from '../../config/assetCategory.config';
import { useAssetCategoryContext } from '../../views/asset/components/assetCategoryContext';

const { Option, OptGroup } = Select;

export interface DeviceTypeSelectProps extends SelectProps<any> {
  sensors?: DeviceType[];
  onChange?: (value: any) => void;
}

const DeviceTypeSelect: FC<DeviceTypeSelectProps> = (props) => {
  const { sensors, children, onChange } = props;
  const category = useAssetCategoryContext();

  useEffect(() => {
    if (onChange && sensors) {
      onChange(sensors[0]);
    }
  }, []);

  const renderSensors = () => {
    return AppConfig.use(window.assetCategory)
      .sensorTypes.filter((item: DeviceType) => sensors?.includes(item))
      .map((item) => (
        <Option key={item} value={item}>
          {DeviceType.toString(item)}
        </Option>
      ));
  };

  const render = () => {
    if (sensors) {
      return (
        <Select {...props} suffixIcon={<CaretDownOutlined />}>
          {children}
          {renderSensors()}
        </Select>
      );
    } else {
      return (
        <Select {...props}>
          <OptGroup label={'网关'} key={'gateway'}>
            <Option key={1} value={1}>
              {DeviceType.toString(DeviceType.Gateway)}
            </Option>
          </OptGroup>
          <OptGroup label={'中继器'} key={'router'}>
            <Option key={257} value={257}>
              {DeviceType.toString(DeviceType.Router)}
            </Option>
          </OptGroup>
          <OptGroup label={'传感器'} key={'sensor'}>
            {SENSORS.get(category)?.map((item) => (
              <Option key={item} value={item}>
                {DeviceType.toString(item)}
              </Option>
            ))}
          </OptGroup>
        </Select>
      );
    }
  };
  return render();
};

export default DeviceTypeSelect;

import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React from 'react';
import DeviceSelect from '../../../../../../components/select/deviceSelect';
import * as AppConfig from '../../../../../../config';
import { defaultValidateMessages, Rules } from '../../../../../../constants/validator';
import { useStore } from '../../../../../../hooks/store';
import { DeviceType } from '../../../../../../types/device_type';
import { isMobile } from '../../../../../../utils/deviceDetection';
import { AssetRow } from '../../../../assetList/props';
import { getAssets } from '../../../../assetList/services';
import { convertRow, Measurement, MeasurementRow } from '../../props';
import { bindDevice, unbindDevice, updateMeasurement } from '../../services';

export const BasicSetting: React.FC<MeasurementRow & { onUpdate?: () => void }> = (props) => {
  const appConfig = AppConfig.use(window.assetCategory);
  const assetLabel = appConfig.assetType.secondAsset?.id
    ? appConfig.assetType.secondAsset?.label
    : appConfig.assetType.label;
  const [types, setTypes] = React.useState(appConfig.sensorTypes);
  const { id, bindingDevices } = props;
  const [form] = Form.useForm<Measurement & { device_id: number }>();
  const [parents, setParents] = React.useState<AssetRow[]>([]);
  const [store] = useStore('measurementListFilters');
  const measurementTypes = AppConfig.getMeasurementTypes(window.assetCategory);
  const deviceType =
    props.bindingDevices && props.bindingDevices.length > 0
      ? props.bindingDevices[0].typeId
      : undefined;

  React.useEffect(() => {
    const assetType = appConfig.assetType.secondAsset?.id
      ? appConfig.assetType.secondAsset?.id
      : appConfig.assetType.id;
    getAssets({ type: assetType }).then((assets) => {
      setParents(
        assets.filter((asset) =>
          store.windTurbineId ? store.windTurbineId === asset.parentId : true
        )
      );
    });
  }, [store, appConfig.assetType]);

  React.useEffect(() => {
    form.resetFields();
    const values = convertRow(props);
    if (values) {
      const type = AppConfig.getMeasurementType(values.type);
      if (type) setTypes(type.deviceType);
      form.setFieldsValue(values);
    }
  }, [form, props]);

  return (
    <Row>
      <Col span={isMobile ? 16 : 8}>
        <Form form={form} labelCol={{ span: 4 }} validateMessages={defaultValidateMessages}>
          <Form.Item label='id' name='id' hidden={true}>
            <Input />
          </Form.Item>
          <Form.Item label='名称' name='name' rules={[Rules.range(4, 50)]}>
            <Input placeholder={`请填写监测点名称`} />
          </Form.Item>
          <Form.Item label='类型' name='type' rules={[{ required: true, message: `请选择类型` }]}>
            <Select placeholder='请选择类型' disabled={!!id}>
              {measurementTypes.map(({ id, label }) => (
                <Select.Option key={id} value={id}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {/* TODO */}
          {/* <Form.Item label='法兰' name='asset_id' rules={[{ required: true, message: `请选择法兰` }]}>
          <Cascader options={parents} fieldNames={{ label: 'name', value: 'id' }} />
        </Form.Item> */}
          <Form.Item
            label='传感器'
            name='device_id'
            rules={[{ required: true, message: `请选择传感器` }]}
          >
            <DeviceSelect filters={{ types: types.join(',') }} />
          </Form.Item>
          <Form.Item
            label={assetLabel}
            name='asset_id'
            rules={[{ required: true, message: `请选择${assetLabel}` }]}
          >
            <Select placeholder={`请选择${assetLabel}`}>
              {parents.map(({ id, name }) => (
                <Select.Option key={id} value={id}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {deviceType === DeviceType.BoltElongationMultiChannels && (
            <Form.Item
              label='通道号'
              name='channel'
              rules={[{ required: true, message: `请选择通道号` }]}
              initialValue={1}
            >
              <Select>
                {[
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                  { label: '3', value: 3 },
                  { label: '4', value: 4 }
                ].map(({ label, value }) => (
                  <Select.Option key={value} value={value}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            label='位置'
            name={['attributes', 'index']}
            initialValue={1}
            rules={[
              { required: true },
              { type: 'integer', min: 1, message: '请填写整数(不能小于1)' }
            ]}
          >
            {window.assetCategory === 'wind' ? (
              <InputNumber placeholder={'请填写位置'} controls={false} style={{ width: '100%' }} />
            ) : (
              <Select placeholder='请选择序号'>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button
              type='primary'
              onClick={() => {
                form.validateFields().then((values) => {
                  if (bindingDevices && bindingDevices.length > 0) {
                    if (bindingDevices[0].id !== values.device_id) {
                      //replace
                      unbindDevice(id, bindingDevices[0].id);
                      bindDevice(id, values.device_id, values.channel);
                    } else {
                      bindDevice(id, values.device_id, values.channel);
                    }
                  } else {
                    bindDevice(id, values.device_id, values.channel);
                  }
                  updateMeasurement(id, values).then(() => {
                    props.onUpdate && props.onUpdate();
                  });
                });
              }}
            >
              保存
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

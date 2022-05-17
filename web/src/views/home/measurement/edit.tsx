import { Form, Input, Modal, ModalProps, Select } from 'antd';
import * as React from 'react';
import { defaultValidateMessages, Rules } from '../../../constants/validator';
import { AssetTypes, MeasurementTypes } from '../asset/constants';
import { AssetRow } from '../asset/props';
import { getAssets } from '../asset/services';
import { convertRow, Measurement, MeasurementRow } from './props';
import { addMeasurement, updateMeasurement } from './services';

export const MeasurementEdit: React.FC<
  ModalProps & { selectedRow?: MeasurementRow } & { onSuccess: () => void }
> = (props) => {
  const { selectedRow, onSuccess } = props;
  const { ID } = selectedRow || {};
  const [form] = Form.useForm<Measurement>();
  const [parents, setParents] = React.useState<AssetRow[]>([
    { ID: 0, Name: '', Type: 0, ParentID: -1, ProjectID: 1 }
  ]);

  React.useEffect(() => {
    getAssets().then((assets) =>
      setParents(assets.filter((asset) => asset.Type === AssetTypes.Flange.type))
    );
  }, []);

  React.useEffect(() => {
    form.resetFields();
    const values = convertRow(selectedRow);
    if (values) form.setFieldsValue(values);
  }, [form, selectedRow]);

  return (
    <Modal
      {...{
        title: ID ? `监测点编辑` : `监测点添加`,
        cancelText: '取消',
        okText: ID ? '更新' : '添加',
        ...props,
        onOk: () => {
          form.validateFields().then((values) => {
            console.log(values);
            const { id } = values;
            try {
              if (!id) {
                addMeasurement(values).then(() => {
                  onSuccess();
                });
              } else {
                updateMeasurement(id, values).then(() => {
                  onSuccess();
                });
              }
            } catch (error) {
              console.log(error);
            }
          });
        }
      }}
    >
      <Form form={form} labelCol={{ span: 4 }} validateMessages={defaultValidateMessages}>
        {ID && (
          <Form.Item label='id' name='id' hidden={true}>
            <Input />
          </Form.Item>
        )}
        <Form.Item label='名称' name='name' rules={[Rules.range(5, 50)]}>
          <Input placeholder={`请填写监测点名称`} />
        </Form.Item>
        <Form.Item label='类型' name='type' rules={[{ required: true, message: `请选择类型` }]}>
          <Select placeholder='请选择类型'>
            {Object.values(MeasurementTypes).map(({ type, label }) => (
              <Select.Option key={type} value={type}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label='法兰' name='asset_id' rules={[{ required: true, message: `请选择法兰` }]}>
          <Select placeholder='请选择法兰'>
            {parents.map(({ ID, Name }) => (
              <Select.Option key={ID} value={ID}>
                {Name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
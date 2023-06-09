import { DatePicker, Form, Modal, ModalProps, Select } from 'antd';
import { FC, useEffect, useState } from 'react';
import { DownloadDeviceDataRequest } from '../../../../../apis/device';
import dayjs, { Dayjs } from '../../../../../utils/dayjsUtils';
import { Device } from '../../../../../types/device';
import { getSpecificProperties } from '../../../util';

const { RangePicker } = DatePicker;
const { Option } = Select;

export interface DownloadModalProps extends ModalProps {
  device: Device;
  property?: any;
  onSuccess: () => void;
  channel?: string;
}

const DownloadModal: FC<DownloadModalProps> = (props) => {
  const { visible, device, property, onSuccess } = props;
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('day').subtract(7, 'd'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().endOf('day'));
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        properties: property ? [property.key] : []
      });
    }
  }, [visible]);

  const onDownload = () => {
    form.validateFields(['properties']).then((values) => {
      const pids = JSON.stringify(values.properties);
      const channel = props.channel;
      const filter = channel ? { pids, channel } : { pids };
      DownloadDeviceDataRequest(
        device.id,
        startDate.utc().unix(),
        endDate.utc().unix(),
        filter
      ).then((res) => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${device.name}.xlsx`);
          document.body.appendChild(link);
          link.click();
          onSuccess();
        }
      });
    });
  };

  return (
    <Modal
      {...props}
      width={390}
      title={'数据下载'}
      okText={'下载'}
      onOk={onDownload}
      cancelText={'取消'}
    >
      <Form form={form}>
        <Form.Item label={'设备属性'} name={'properties'} required>
          <Select placeholder={'请选择设备属性'} mode={'multiple'} maxTagCount={2}>
            {getSpecificProperties(
              device.properties.filter((pro) => pro.key !== 'channel'),
              device.typeId
            ).map((item) => (
              <Option key={item.key} value={item.key}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={'时间范围'} required>
          <RangePicker
            allowClear={false}
            style={{ width: '252px' }}
            value={[startDate, endDate]}
            onChange={(_, dateString) => {
              if (dateString) {
                setStartDate(dayjs(dateString[0]).startOf('day'));
                setEndDate(dayjs(dateString[1]).endOf('day'));
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DownloadModal;

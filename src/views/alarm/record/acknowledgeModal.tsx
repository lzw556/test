import { Form, Input, Modal, ModalProps } from 'antd';
import { AcknowledgeAlarmRecordRequest } from '../../../apis/alarm';
import { FC, useEffect } from 'react';

export interface AcknowledgeModalProps extends ModalProps {
  record: any;
  onSuccess: () => void;
}

const AcknowledgeModal: FC<AcknowledgeModalProps> = (props) => {
  const [form] = Form.useForm();
  const { record, onSuccess } = props;

  useEffect(() => {
    form.setFieldsValue({
      source: record.source,
      content: `${record.metric.name} ${record.operation} ${record.threshold}${record.metric.unit} 报警值: ${record.value}${record.metric.unit}`
    });
  }, [record]);

  const onSave = () => {
    form.validateFields().then((values) => {
      AcknowledgeAlarmRecordRequest(record.id, values).then((_) => onSuccess());
    });
  };

  return (
    <Modal {...props} width={400} title={'报警处理'} onOk={onSave}>
      <Form form={form} labelCol={{ span: 6 }}>
        <Form.Item label={'报警源'} name={['source', 'name']}>
          <Input disabled />
        </Form.Item>
        <Form.Item label={'报警详情'} name={['content']}>
          <Input disabled />
        </Form.Item>
        <Form.Item label={'处理意见'} name={'note'} initialValue={''}>
          <Input.TextArea placeholder={'请输入处理意见'} rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AcknowledgeModal;

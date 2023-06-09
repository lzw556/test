import { Modal, Spin } from 'antd';
import * as React from 'react';
import { PageResult } from '../../../../types/page';
import { FilterableAlarmRuleTable } from './filterableAlarmRuleTable';

export const AlarmRuleSelection: React.FC<{
  isLoaded: boolean;
  dataSource: PageResult<any[]>;
  fetchData: (current: number, size: number, crtRules?: any) => void;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (ids: string[]) => void;
}> = ({ visible, setVisible, onSelect, isLoaded, dataSource, fetchData }) => {
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);

  if (!isLoaded) return <Spin tip='加载中' />;
  if (dataSource && dataSource.result) {
    return (
      <Modal
        visible={visible}
        title='报警规则'
        okText='确定'
        cancelText='取消'
        onCancel={() => setVisible(false)}
        onOk={() => {
          setVisible(false);
          onSelect(selectedRowKeys);
        }}
      >
        <FilterableAlarmRuleTable
          dataSource={dataSource}
          fetchData={fetchData}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys: any) => setSelectedRowKeys(selectedRowKeys)
          }}
        />
      </Modal>
    );
  }
  return null;
};

import { Col, Empty, Row, Spin, Table } from 'antd';
import * as React from 'react';
import { FlangeStatusData, SingleFlangeStatus } from './single';
import dayjs from '../../../../utils/dayjsUtils';
import { RangeDatePicker } from '../../../../components/rangeDatePicker';
import { AssetRow, getDataOfAsset, getFlangeData } from '../../../asset';

export const FakeFlangeStatus: React.FC<AssetRow> = (props) => {
  const [range, setRange] = React.useState<[number, number]>();
  const [timestamps, setTimestamps] = React.useState<{ timestamp: number }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [timestamp, setTimestamp] = React.useState<number>();
  const [loading2, setLoading2] = React.useState(true);
  const [flangeData, setFlangeData] = React.useState<FlangeStatusData>();

  React.useEffect(() => {
    if (range) {
      const [from, to] = range;
      getDataOfAsset(props.id, from, to).then((data) => {
        setTimestamps(data);
        setLoading(false);
      });
    }
  }, [range, props.id]);

  React.useEffect(() => {
    if (timestamps.length > 0) {
      setTimestamp(timestamps[0].timestamp);
    } else {
      setTimestamp(undefined);
    }
  }, [timestamps]);

  React.useEffect(() => {
    if (timestamp) {
      setLoading2(true);
      getFlangeData(props.id, timestamp).then((data) => {
        setFlangeData(data);
        setLoading2(false);
      });
    }
  }, [props.id, timestamp]);

  const renderTimestampsSearchResult = () => {
    if (loading) return <Spin />;
    let content = null;
    if (timestamps.length === 0) {
      content = (
        <Col span={24}>
          <Empty description='暂无数据' image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Col>
      );
    } else {
      content = (
        <>
          <Col span={6}>{renderTimestampsTable()}</Col>
          <Col span={18}>{renderSelectedTimestampRelation()}</Col>
        </>
      );
    }
    return <Row>{content}</Row>;
  };

  const renderTimestampsTable = () => {
    return (
      <Table
        size={'middle'}
        scroll={{ y: 600 }}
        showHeader={false}
        columns={[
          {
            title: '时间',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '80%',
            render: (timestamp: number) =>
              dayjs.unix(timestamp).local().format('YYYY-MM-DD HH:mm:ss')
          }
        ]}
        pagination={false}
        dataSource={timestamps}
        rowClassName={(record) => (record.timestamp === timestamp ? 'ant-table-row-selected' : '')}
        onRow={(record) => ({
          onClick: () => {
            if (record.timestamp !== timestamp) {
              setTimestamp(record.timestamp);
            }
          },
          onMouseLeave: () => (window.document.body.style.cursor = 'default'),
          onMouseEnter: () => (window.document.body.style.cursor = 'pointer')
        })}
      />
    );
  };

  const renderSelectedTimestampRelation = () => {
    if (!timestamp) return <Empty description='请选择时间' image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    if (loading2) return <Spin />;
    return (
      <SingleFlangeStatus
        properties={
          props.monitoringPoints && props.monitoringPoints.length > 0
            ? props.monitoringPoints[0].properties
            : []
        }
        flangeData={flangeData}
      />
    );
  };

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <RangeDatePicker
          onChange={React.useCallback((range: [number, number]) => setRange(range), [])}
        />
      </Col>
      <Col span={24}>{renderTimestampsSearchResult()}</Col>
    </Row>
  );
};

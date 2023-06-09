import { Col, Empty, Row } from 'antd';
import React from 'react';
import { checkIsFlangePreload } from '..';
import { generateColProps } from '../../../utils/grid';
import { AssetRow } from '../../asset';
import { HistoryData, NO_MONITORING_POINTS } from '../../monitoring-point';
import { CircleChart } from '../circleChart';
import { FlangePreloadChart } from '../flangePreloadChart';
import { FlangeHistoryChart } from '../historyChart';

export const FlangeMonitor = ({
  flange,
  historyDatas
}: {
  flange: AssetRow;
  historyDatas: { name: string; data: HistoryData }[] | undefined;
}) => {
  if (flange.monitoringPoints === undefined || flange.monitoringPoints.length === 0)
    return <Empty description={NO_MONITORING_POINTS} image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <Row gutter={[16, 16]}>
      <Col {...generateColProps({ xl: 12, xxl: 9 })}>
        <CircleChart asset={flange} title='分布图' big={true} style={{ height: 550 }} />
      </Col>
      <Col {...generateColProps({ xl: 12, xxl: 15 })}>
        {checkIsFlangePreload(flange) ? (
          <FlangePreloadChart points={flange.monitoringPoints} />
        ) : (
          <FlangeHistoryChart flange={flange} historyDatas={historyDatas} />
        )}
      </Col>
    </Row>
  );
};

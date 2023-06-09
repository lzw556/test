import { Empty, Table } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import usePermission, { Permission } from '../../permission/permission';
import { isMobile } from '../../utils/deviceDetection';
import { AssetRow } from '../asset/types';
import {
  MonitoringPointRow,
  useMonitoringPointTableColumns,
  useMonitoringPointTableOperationColumn,
  generatePropertyColumns,
  getRealPoints,
  sortMonitoringPointByAttributes
} from '../monitoring-point';
import { FLANGE_PATHNAME } from './types';

export const MonitoringPointsTable = ({
  asset,
  showTitle = true,
  onUpdate,
  onDeleteSuccess
}: {
  asset: AssetRow;
  showTitle?: boolean;
  onUpdate: (point: MonitoringPointRow) => void;
  onDeleteSuccess: () => void;
}) => {
  const { id, name, monitoringPoints = [] } = asset;
  const { state } = useLocation();
  const { hasPermission } = usePermission();
  const dataSource = sortMonitoringPointByAttributes(getRealPoints(monitoringPoints));
  const columnsOfProperties =
    monitoringPoints.length > 0 ? generatePropertyColumns(monitoringPoints[0]) : [];
  const monitoringPointTableColumns = useMonitoringPointTableColumns();
  const monitoringPointTableOperationColumn = useMonitoringPointTableOperationColumn(
    onUpdate,
    onDeleteSuccess
  );
  const columnsForDisplay = [...monitoringPointTableColumns, ...columnsOfProperties];
  const columns = hasPermission(Permission.MeasurementAdd)
    ? [...columnsForDisplay, monitoringPointTableOperationColumn]
    : columnsForDisplay;

  return (
    <>
      {showTitle && (
        <Link
          to={`/${FLANGE_PATHNAME}/${id}`}
          state={state}
          style={{ display: 'block', marginBottom: 8, fontSize: 16 }}
        >
          {name}
        </Link>
      )}
      <Table
        {...{
          rowKey: 'id',
          columns,
          size: 'small',
          dataSource,
          pagination: false,
          locale: {
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' />
          },
          bordered: true,
          scroll: isMobile ? { x: 1000 } : { x: 1300 }
        }}
      />
    </>
  );
};

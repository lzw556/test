import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Popconfirm, Row, Space, Table, TableProps, Tag } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { AssetRow } from '../../assetList/props';
import { generatePropertyColumns } from '../../common/historyDataHelper';
import {
  convertAlarmLevelToState,
  getAlarmLevelColor,
  getAlarmStateText
} from '../../common/statisticsHelper';
import { MeasurementRow } from './props';
import { deleteMeasurement } from './services';
import { combineFinalUrl, getRealPoints } from '../../common/utils';
import { sortMeasurementsByAttributes } from '../../measurementList/util';
import usePermission, { Permission } from '../../../../permission/permission';
import HasPermission from '../../../../permission';
import { isMobile } from '../../../../utils/deviceDetection';
import ShadowCard from '../../../../components/shadowCard';
import { EditFormPayload } from '../../common/useActionBarStatus';
import * as AppConfig from '../../../../config';
import { measurementTypes } from '../../common/constants';

export const MeasurementOfFlangeList: React.FC<{
  flange?: AssetRow;
  pathname: string;
  search: string;
  handleMeasurementEdit: (data?: EditFormPayload) => void;
  fetchAssets: (filters?: Pick<AssetRow, 'type'>) => void;
}> = ({ flange, pathname, search, handleMeasurementEdit, fetchAssets }) => {
  const { hasPermission } = usePermission();
  const generateTables = () => {
    if (!flange) return null;
    const measurements = getRealPoints(flange.monitoringPoints);
    if (measurements.length === 0)
      return (
        <ShadowCard>
          <Empty description='没有监测点' image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </ShadowCard>
      );
    return <Row gutter={[0, 16]}>{generateTable(sortMeasurementsByAttributes(measurements))}</Row>;
  };

  const getColumns = (dataSource: TableProps<any>['dataSource']) => {
    const columns: any = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: isMobile ? 300 : 400,
        render: (name: string, row: MeasurementRow) => (
          <Link to={combineFinalUrl(pathname, search, measurementTypes.preload.url, row.id)}>
            {name}
          </Link>
        )
      },
      {
        title: '状态',
        dataIndex: 'alertLevel',
        key: 'alertLevel',
        width: 120,
        render: (level: number) => {
          const alarmState = convertAlarmLevelToState(level);
          return <Tag color={getAlarmLevelColor(alarmState)}>{getAlarmStateText(alarmState)}</Tag>;
        }
      },
      {
        title: '传感器',
        dataIndex: 'devices',
        key: 'devices',
        width: 200,
        render: (name: string, row: MeasurementRow) =>
          row.bindingDevices && row.bindingDevices.length > 0
            ? row.bindingDevices.map(({ id, name }) => <Link to={`devices/${id}`}>{name}</Link>)
            : ''
      },
      ...generatePropertyColumns(dataSource ? dataSource[0] : [])
    ];
    if (hasPermission(Permission.AssetAdd)) {
      return columns.concat([
        {
          title: '操作',
          key: 'action',
          render: (row: MeasurementRow) => (
            <Space>
              <Button type='text' size='small' title='编辑监测点'>
                <EditOutlined onClick={() => handleMeasurementEdit({ measurement: row })} />
              </Button>
              <HasPermission value={Permission.MeasurementDelete}>
                <Popconfirm
                  title={'确定要删除该监测点吗?'}
                  onConfirm={() => {
                    deleteMeasurement(row.id).then(() => {
                      fetchAssets({ type: AppConfig.use('wind').assetType.id });
                    });
                  }}
                >
                  <Button type='text' danger={true} size='small' title='删除监测点'>
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              </HasPermission>
            </Space>
          ),
          width: 120
        }
      ]);
    } else {
      return columns;
    }
  };

  const generateTable = (dataSource: TableProps<any>['dataSource']) => {
    return (
      <Col span={24}>
        <Table
          {...{
            rowKey: 'id',
            columns: getColumns(dataSource),
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
      </Col>
    );
  };

  return generateTables();
};

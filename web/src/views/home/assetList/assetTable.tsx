import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Popconfirm, Space, Table } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { deleteAsset } from './services';
import { AssetTypes } from '../common/constants';
import { getAssetStatistics } from '../common/statisticsHelper';
import { combineFinalUrl } from '../common/utils';
import { AssetRow } from './props';

export const AssetTable: React.FC<{
  dataSource?: any;
  loading?: boolean;
  pathname: string;
  search: string;
  open: (initialValues: typeof AssetTypes.WindTurbind, selectedRow?: AssetRow) => void;
  fetchAssets: (filters?: Pick<AssetRow, 'type'>) => void;
}> = ({ dataSource, loading, pathname, search, open, fetchAssets }) => {
  const getAssetType = (typeId: number) => {
    return Object.values(AssetTypes).find((type) => type.id === typeId);
  };

  return (
    <Table
      {...{
        rowKey: (row: AssetRow) => `${row.id}-${row.type}`,
        columns: [
          {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 400,
            render: (name: string, row: AssetRow) => {
              const assetType = getAssetType(row.type);
              const hasChildren =
                (row.monitoringPoints && row.monitoringPoints.length) ||
                (row.children && row.children.length);
              return assetType && hasChildren ? (
                <Link to={combineFinalUrl(pathname, search, assetType.url, row.id)}>{name}</Link>
              ) : (
                name
              );
            }
          },
          {
            title: '类型',
            dataIndex: 'assetType',
            key: 'assetType',
            width: 200,
            render: (name: string, row: AssetRow) => {
              const assetType = getAssetType(row.type);
              const flangeType = row.attributes?.type;
              if (
                assetType &&
                assetType.id === AssetTypes.Flange.id &&
                flangeType &&
                assetType.categories
              ) {
                return (
                  assetType.categories.find((cate) => cate.value === flangeType)?.label +
                  AssetTypes.Flange.label
                );
              }
              return assetType?.label;
            }
          },
          {
            title: '监测点',
            dataIndex: 'measurementNum',
            key: 'measurementNum',
            width: 150,
            render: (name: string, row: AssetRow) => {
              const { statistics } = getAssetStatistics(row.statistics, 'monitoringPointNum');
              return statistics.length > 0 ? statistics[0].value : '-';
            }
          },
          {
            title: '异常监测点',
            dataIndex: 'errorMeasurementNum',
            key: 'errorMeasurementNum',
            width: 150,
            render: (name: string, row: AssetRow) => {
              const { statistics } = getAssetStatistics(row.statistics, [
                'anomalous',
                '异常监测点'
              ]);
              return statistics.length > 0 ? statistics[0].value : '-';
            }
          },
          {
            title: '传感器',
            dataIndex: 'sensorNum',
            key: 'sensorNum',
            width: 150,
            render: (name: string, row: AssetRow) => {
              const { statistics } = getAssetStatistics(row.statistics, 'deviceNum');
              return statistics.length > 0 ? statistics[0].value : '-';
            }
          },
          {
            title: '离线传感器',
            dataIndex: 'offlineNum',
            key: 'offlineNum',
            width: 150,
            render: (name: string, row: AssetRow) => {
              const { statistics } = getAssetStatistics(row.statistics, 'offlineDeviceNum');
              return statistics.length > 0 ? statistics[0].value : '-';
            }
          },
          {
            title: '操作',
            key: 'action',
            render: (x, row: AssetRow) => {
              const assetType = getAssetType(row.type);
              const name = assetType ? assetType.label : '风机';
              return (
                <Space>
                  <Button type='text' size='small' title={`编辑${name}`}>
                    <EditOutlined onClick={() => assetType && open(assetType, row)} />
                  </Button>
                  <Popconfirm
                    title={`确定要删除该${name}吗?`}
                    onConfirm={() => {
                      deleteAsset(row.id).then(() => {
                        fetchAssets({ type: AssetTypes.WindTurbind.id });
                      });
                    }}
                  >
                    <Button type='text' danger={true} size='small' title={`删除${name}`}>
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                  {row.type === AssetTypes.WindTurbind.id && (
                    <Button type='text' size='small' title='添加法兰'>
                      <PlusOutlined
                        style={{ color: 'rgba(0,0,0,.55)' }}
                        onClick={() => open({ ...AssetTypes.Flange, parent_id: row.id })}
                      />
                    </Button>
                  )}
                </Space>
              );
            }
          }
        ],
        size: 'small',
        pagination: false,
        locale: {
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' />
        },
        dataSource,
        loading
      }}
    />
  );
};
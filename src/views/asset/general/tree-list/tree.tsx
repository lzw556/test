import { ArrowRightOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Popconfirm, Space, Tree } from 'antd';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROOT_ASSETS } from '../../../../config/assetCategory.config';
import HasPermission from '../../../../permission';
import { Permission } from '../../../../permission/permission';
import { isMobile } from '../../../../utils/deviceDetection';
import { mapTreeNode } from '../../../../utils/tree';
import {
  MonitoringPointIcon,
  deleteMeasurement,
  MonitoringPointRow,
  generateDatasOfMeasurement,
  getRealPoints,
  MONITORING_POINT
} from '../../../monitoring-point';
import { convertAlarmLevelToState } from '../../common/statisticsHelper';
import { useAssetCategoryContext } from '../../components/assetCategoryContext';
import { deleteAsset } from '../../services';
import { AssetRow } from '../../types';
import { GENERAL } from '../common/types';
import { getPathFromType, getValidParents, sortAssetsByIndex } from '../common/utils';
import { GeneralIcon } from '../icon/icon';
import './tree.css';

export const GeneralTree: React.FC<{
  assets: AssetRow[];
  onGeneralCreate?: (paras: AssetRow[] | number) => void;
  onGeneralUpdate?: (asset: AssetRow, parents?: AssetRow[]) => void;
  onMonitoringPointCreate?: (paras: AssetRow[] | AssetRow) => void;
  onMonitoringPointUpdate?: (monitoringPoint: MonitoringPointRow, parents: AssetRow[]) => void;
  onsuccess?: () => void;
}> = ({
  assets,
  onGeneralCreate,
  onGeneralUpdate,
  onMonitoringPointCreate,
  onMonitoringPointUpdate,
  onsuccess
}) => {
  const { state } = useLocation();
  const [treedata, setTreedata] = React.useState<any>();
  const [selectedNode, setSelectedNode] = React.useState<any>();
  const category = useAssetCategoryContext();
  const GENERAL_ASSET_TYPE_ID = ROOT_ASSETS.get('general');

  const getTreedata = React.useCallback(
    (assets: AssetRow[]) => {
      const processNodeFn = (node: any) => {
        const points = getRealPoints(node.monitoringPoints);
        const children = node.children ?? [];
        if (children.length > 0 && points.length > 0) {
          return { ...node, children: [...children, ...points] };
        } else if (node.children && node.children.length > 0) {
          return { ...node, children: sortAssetsByIndex(children as AssetRow[]) };
        } else if (points.length > 0) {
          return {
            ...node,
            children: points,
            monitoringPoints: []
          };
        } else {
          return node;
        }
      };
      if (assets.length > 0) {
        const copy = cloneDeep(assets);
        const treedata = copy
          .map((node: any) => mapTreeNode(node, processNodeFn))
          .map((node) =>
            mapTreeNode(node, (node) => ({
              ...node,
              key: `${node.id}-${node.type}`,
              icon: (props: any) => {
                const alarmState = convertAlarmLevelToState(props.alertLevel);
                if (props.type === GENERAL_ASSET_TYPE_ID) {
                  return <GeneralIcon className={alarmState} />;
                } else {
                  return <MonitoringPointIcon className={`${alarmState} focus`} />;
                }
              }
            }))
          );
        setTreedata(treedata);
      }
    },
    [GENERAL_ASSET_TYPE_ID]
  );

  React.useEffect(() => {
    getTreedata(assets.filter((asset) => asset.parentId === 0));
  }, [assets, getTreedata]);

  if (!treedata) return null;
  return (
    <Tree
      treeData={treedata}
      fieldNames={{ key: 'key', title: 'name' }}
      showIcon={true}
      className='asset-list-tree'
      titleRender={(props: any) => {
        const name = `${props.name}`;
        let alarmText = null;
        if (props.type > 10000) {
          const nameValues = generateDatasOfMeasurement(props);
          if (nameValues.length > 0) {
            alarmText = (
              <Space style={{ fontSize: 14, color: '#8a8e99' }}>
                {nameValues.map(({ name, value }) => `${name}: ${value}`)}
              </Space>
            );
          }
        }
        return (
          <Space>
            {name}
            {!isMobile && alarmText}
            {selectedNode?.key === props.key && (
              <>
                <HasPermission value={Permission.AssetAdd}>
                  <Button type='text' size='small'>
                    <EditOutlined
                      onClick={() => {
                        const type = selectedNode?.type;
                        const parents = getValidParents(assets, selectedNode);
                        if (type === GENERAL_ASSET_TYPE_ID) {
                          onGeneralUpdate?.(selectedNode, parents);
                        } else {
                          onMonitoringPointUpdate?.(selectedNode, parents);
                        }
                      }}
                    />
                  </Button>
                  <HasPermission value={Permission.AssetDelete}>
                    <Popconfirm
                      title={`确定要删除${name}吗?`}
                      onConfirm={() => {
                        if (selectedNode?.type < 10000) {
                          deleteAsset(selectedNode?.id).then(() => {
                            if (onsuccess) onsuccess();
                          });
                        } else {
                          deleteMeasurement(selectedNode?.id).then(() => {
                            if (onsuccess) onsuccess();
                          });
                        }
                      }}
                    >
                      <Button type='text' danger={true} size='small' title={`删除${name}`}>
                        <DeleteOutlined />
                      </Button>
                    </Popconfirm>
                  </HasPermission>
                  {selectedNode?.type < 10000 && (
                    <Dropdown
                      menu={{
                        items: [
                          { key: 'general-create', label: GENERAL },
                          { key: 'monitoring-point-create', label: MONITORING_POINT }
                        ],
                        onClick: ({ key }) => {
                          const type = selectedNode?.type;
                          if (type === GENERAL_ASSET_TYPE_ID) {
                            console.log('keykeykey', key);
                            key === 'general-create'
                              ? onGeneralCreate?.(selectedNode?.id)
                              : onMonitoringPointCreate?.(selectedNode?.id);
                          }
                        }
                      }}
                    >
                      <Button type='text' size='small'>
                        <PlusOutlined />
                      </Button>
                    </Dropdown>
                  )}
                </HasPermission>
                <Link
                  to={`${getPathFromType(category, selectedNode?.type)}${selectedNode?.id}`}
                  state={state}
                >
                  <Button type='text' size='small'>
                    <ArrowRightOutlined />
                  </Button>
                </Link>
              </>
            )}
          </Space>
        );
      }}
      onSelect={(selectedKeys: any, e: any) => {
        setSelectedNode(e.node);
      }}
      defaultExpandAll={true}
      height={780}
    />
  );
};

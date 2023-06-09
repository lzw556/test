import * as React from 'react';
import { PageResult } from '../../types/page';
import dayjs from '../../utils/dayjsUtils';
import {
  GetAlarmRecordAcknowledgeRequest,
  PagingAlarmRecordRequest,
  RemoveAlarmRecordRequest
} from '../../apis/alarm';
import { Button, Col, Popconfirm, Row, Select, Space, Tag, Tree } from 'antd';
import { ColorDanger, ColorInfo, ColorWarn } from '../../constants/color';
import { DeleteOutlined } from '@ant-design/icons';
import TableLayout from '../../views/layout/TableLayout';
import { isMobile } from '../../utils/deviceDetection';
import AcknowledgeModal from '../../views/alarm/record/acknowledgeModal';
import AcknowledgeViewModal from '../../views/alarm/record/acknowledgeViewModal';
import HasPermission from '../../permission';
import { Permission } from '../../permission/permission';
import Label from '../label';
import { RangeDatePicker } from '../rangeDatePicker';
import { Store, useStore } from '../../hooks/store';

const { Option } = Select;

export const FilterableAlarmRecordTable: React.FC<{ sourceId?: number }> = ({ sourceId }) => {
  const [dataSource, setDataSource] = React.useState<PageResult<any[]>>();
  const [alarmRecord, setAlarmRecord] = React.useState<any>();
  const [acknowledge, setAcknowledge] = React.useState<any>();
  const [status, setStatus] = React.useState<any>([0, 1, 2]);
  const [store, setStore, gotoPage] = useStore('alarmRecordList');

  const fetchAlarmRecords = (status: any, store: Store['alarmRecordList'], sourceId?: number) => {
    const {
      pagedOptions: { index, size },
      alertLevels,
      range
    } = store;
    const filters: any = {
      levels: alertLevels.join(','),
      status: ''
    };
    if (status && status.length > 0) {
      filters.status = status.join(',');
    }
    if (range) {
      const [from, to] = range;
      PagingAlarmRecordRequest(index, size, from, to, filters, sourceId).then((res) => {
        setDataSource({
          page: res.page,
          size: res.size,
          total: res.total,
          result: res.result.sort(
            (prev: any, next: any) => prev.alarmRuleGroupId - next.alarmRuleGroupId
          )
        });
      });
    }
  };

  React.useEffect(() => {
    fetchAlarmRecords(status, store, sourceId);
  }, [status, sourceId, store]);

  const onDelete = (id: number) => {
    RemoveAlarmRecordRequest(id).then((_) => {
      if (dataSource) {
        const { size, page, total } = dataSource;
        gotoPage({ size, total, index: page }, 'prev');
      }
    });
  };

  const onAcknowledge = (record: any) => {
    setAlarmRecord(record);
  };

  const onViewAcknowledge = (id: number) => {
    GetAlarmRecordAcknowledgeRequest(id).then(setAcknowledge);
  };

  const renderFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
    const data = {
      title: '全选',
      key: -1,
      children: [
        {
          title: '未处理',
          key: 0
        },
        {
          title: '手动处理',
          key: 1
        },
        {
          title: '系统自动处理',
          key: 2
        }
      ]
    };
    return (
      <div style={{ padding: '4px 4px' }}>
        <Row justify={'start'}>
          <Col span={24}>
            <Tree
              treeData={[data]}
              selectable={false}
              checkable
              defaultExpandAll
              checkedKeys={status}
              showLine={false}
              showIcon={false}
              onCheck={(checkKeys: any, e: any) => {
                setStatus(checkKeys.filter((key: any) => key !== -1));
              }}
            />
          </Col>
        </Row>
      </div>
    );
  };

  const columns: any = [
    {
      title: '报警名称',
      dataIndex: 'alarmRuleGroupName',
      key: 'alarmRuleGroupName',
      width: '15%',
      render: (name: string, record: any) => {
        return record.alarmRuleGroupId === 0 ? '已删除' : name;
      }
    },
    {
      title: '报警级别',
      dataIndex: 'level',
      key: 'level',
      width: '8%',
      render: (level: number) => {
        switch (level) {
          case 1:
            return <Tag color={ColorInfo}>次要</Tag>;
          case 2:
            return <Tag color={ColorWarn}>重要</Tag>;
          case 3:
            return <Tag color={ColorDanger}>紧急</Tag>;
        }
      }
    },
    // {
    //     title: '资源指标',
    //     dataIndex: 'source',
    //     key: 'type',
    //     width: '10%',
    //     render: (source: any) => {
    //         if (source) {
    //             return DeviceType.toString(source.typeId)
    //         }
    //         return "未知指标"
    //     }
    // },
    {
      title: '报警源',
      dataIndex: 'source',
      key: 'source',
      width: '10%',
      render: (source: any, record: any) => {
        if (source) {
          return source.name;
        }
        return '未知资源';
      }
    },
    {
      title: '报警详情',
      dataIndex: 'metric',
      key: 'metric',
      width: '15%',
      render: (metric: any, record: any) => {
        return `${metric.name} ${record.operation} ${record.threshold}${metric.unit} 报警值: ${record.value}${metric.unit}`;
      }
    },
    {
      title: '发生时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (createdAt: number) => {
        return dayjs.unix(createdAt).local().format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '持续时间',
      dataIndex: 'duration',
      key: 'duration',
      width: '10%',
      render: (_: any, record: any) => {
        switch (record.status) {
          case 1:
          case 2:
            return dayjs
              .unix(record.createdAt)
              .local()
              .from(dayjs.unix(record.updatedAt).local(), true);
          default:
            return dayjs.unix(record.createdAt).local().fromNow(true);
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '5%',
      filterDropdown: renderFilterDropdown,
      render: (status: number) => {
        switch (status) {
          case 1:
            return <Tag color='blue'>手动处理</Tag>;
          case 2:
            return <Tag color='green'>系统自动处理</Tag>;
          default:
            return <Tag>未处理</Tag>;
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 64,
      // fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <Space>
            {record.status === 0 ? (
              <HasPermission value={Permission.AlarmRecordAcknowledge}>
                <Button type='link' ghost size={'small'} onClick={() => onAcknowledge(record)}>
                  标记为已处理
                </Button>
              </HasPermission>
            ) : (
              <HasPermission value={Permission.AlarmRecordAcknowledgeGet}>
                <Button
                  disabled={record.status === 2}
                  type='link'
                  ghost
                  size={'small'}
                  onClick={() => onViewAcknowledge(record.id)}
                >
                  查看处理详情
                </Button>
              </HasPermission>
            )}
            <HasPermission value={Permission.AlarmRecordDelete}>
              <Popconfirm
                placement='left'
                title='确认要删除该报警记录吗?'
                onConfirm={() => onDelete(record.id)}
                okText='删除'
                cancelText='取消'
              >
                <Button type='text' size='small' icon={<DeleteOutlined />} danger />
              </Popconfirm>
            </HasPermission>
          </Space>
        );
      }
    }
  ];

  return (
    <>
      <Row justify={'start'}>
        <Col span={24}>
          <Space direction={isMobile ? 'vertical' : 'horizontal'}>
            <Label name={'报警级别'}>
              <Select
                bordered={false}
                mode={'multiple'}
                value={store.alertLevels}
                style={{ width: '220px' }}
                onChange={(value) => {
                  if (value.length) {
                    setStore((prev) => ({ ...prev, alertLevels: value }));
                  } else {
                    setStore((prev) => ({ ...prev, alertLevels: [1, 2, 3] }));
                  }
                }}
              >
                <Option key={1} value={1}>
                  次要
                </Option>
                <Option key={2} value={2}>
                  重要
                </Option>
                <Option key={3} value={3}>
                  紧急
                </Option>
              </Select>
            </Label>
            <RangeDatePicker
              defaultRange={[dayjs.unix(store.range[0]), dayjs.unix(store.range[1])]}
              onChange={React.useCallback(
                (range: [number, number]) => {
                  setStore((prev) => {
                    if (
                      prev.range &&
                      range &&
                      prev.range.length === 2 &&
                      range.length === prev.range.length &&
                      range[1] === prev.range[1] &&
                      range[0] === prev.range[0]
                    ) {
                      return prev;
                    } else {
                      return { ...prev, range };
                    }
                  });
                },
                [setStore]
              )}
            />
          </Space>
        </Col>
      </Row>
      <br />
      <Row justify={'start'}>
        <Col span={24}>
          <TableLayout
            emptyText={'报警记录列表为空'}
            columns={columns}
            dataSource={dataSource}
            onPageChange={(index, size) =>
              setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
            }
            simple={isMobile}
            scroll={isMobile ? { x: 1200 } : undefined}
          />
        </Col>
      </Row>
      {alarmRecord && (
        <AcknowledgeModal
          visible={alarmRecord}
          record={alarmRecord}
          onCancel={() => setAlarmRecord(undefined)}
          onSuccess={() => {
            setAlarmRecord(undefined);
            fetchAlarmRecords(status, store, sourceId);
          }}
        />
      )}
      {acknowledge && (
        <AcknowledgeViewModal
          visible={acknowledge}
          acknowledge={acknowledge}
          onCancel={() => setAcknowledge(undefined)}
        />
      )}
    </>
  );
};

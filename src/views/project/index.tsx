import { Content } from 'antd/es/layout/layout';
import ShadowCard from '../../components/shadowCard';
import TableLayout from '../layout/TableLayout';
import { Button, Card, Modal, Popconfirm, Space, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { PageResult } from '../../types/page';
import {
  DeleteProjectRequest,
  GenProjectAccessTokenRequest,
  PagingProjectsRequest
} from '../../apis/project';
import EditProjectModal from './editProjectModal';
import { Project } from '../../types/project';
import AllocUserDrawer from './allocUserDrawer';
import HasPermission from '../../permission';
import usePermission, { Permission } from '../../permission/permission';
import { Store, useStore } from '../../hooks/store';
import { store as reduxStore } from '../../store';
import { PageTitle } from '../../components/pageTitle';

const ProjectPage = () => {
  const [visible, setVisible] = useState(false);
  const [allocVisible, setAllocVisible] = useState(false);
  const [dataSource, setDataSource] = useState<PageResult<any>>();
  const [project, setProject] = useState<Project>();
  const { hasPermissions } = usePermission();
  const [store, setStore, gotoPage] = useStore('projectList');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const fetchProjects = (store: Store['firmwareList']) => {
    const {
      pagedOptions: { index, size }
    } = store;
    PagingProjectsRequest(index, size).then(setDataSource);
  };

  useEffect(() => {
    fetchProjects(store);
  }, [store, refreshKey]);

  const onAllocUser = (record: Project) => {
    setAllocVisible(true);
    setProject(record);
  };

  const onEdit = (record: Project) => {
    setProject(record);
    setVisible(true);
  };

  const onDelete = (id: number) => {
    DeleteProjectRequest(id).then(() => {
      reduxStore.dispatch({
        type: 'SET_PROJECT',
        payload: 0
      });
      if (dataSource) {
        const { size, page, total } = dataSource;
        gotoPage({ size, total, index: page }, 'prev');
      }
      window.location.reload();
    });
  };

  const onGenAccessToken = (id: number) => {
    GenProjectAccessTokenRequest(id).then((_) => {
      setRefreshKey(refreshKey + 1);
    });
  };

  const onViewAccessToken = (token: string) => {
    Modal.info({
      title: '访问凭证',
      content: (
        <Card size={'small'} style={{ backgroundColor: 'rgb(37, 43, 58)' }}>
          <Typography.Text style={{ color: '#fff' }} copyable={{ text: token }}>
            {token}
          </Typography.Text>
        </Card>
      ),
      icon: null,
      okText: '确定'
    });
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: '10%'
    },
    {
      title: '访问凭证',
      dataIndex: 'token',
      key: 'token',
      width: '20%',
      render: (token: string, record: Project) => {
        if (token) {
          return (
            <Button
              type={'link'}
              onClick={() => {
                onViewAccessToken(token);
              }}
            >
              点击查看
            </Button>
          );
        }
        return (
          <Button
            type={'link'}
            onClick={() => {
              onGenAccessToken(record.id);
            }}
          >
            点击生成访问凭证
          </Button>
        );
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_: any, record: any) => {
        return (
          <Space>
            {hasPermissions(Permission.ProjectAllocUser, Permission.ProjectAllocUserGet) && (
              <Button type={'link'} size={'small'} onClick={() => onAllocUser(record)}>
                分配用户
              </Button>
            )}
            <HasPermission value={Permission.ProjectEdit}>
              <Button type={'text'} size={'small'} onClick={() => onEdit(record)}>
                <EditOutlined />
              </Button>
            </HasPermission>
            <HasPermission value={Permission.ProjectDelete}>
              <Popconfirm title={'确定要删除该项目吗?'} onConfirm={() => onDelete(record.id)}>
                <Button type={'text'} size={'small'} danger>
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </HasPermission>
          </Space>
        );
      }
    }
  ];

  return (
    <Content>
      <PageTitle
        items={[{ title: '项目管理' }]}
        actions={
          <HasPermission value={Permission.ProjectAdd}>
            <Button type={'primary'} onClick={() => setVisible(true)}>
              添加项目
              <PlusOutlined />
            </Button>
          </HasPermission>
        }
      />
      <ShadowCard>
        <TableLayout
          emptyText={'项目列表为空'}
          permissions={[
            Permission.ProjectEdit,
            Permission.ProjectDelete,
            Permission.ProjectAllocUserGet,
            Permission.ProjectAllocUser
          ]}
          dataSource={dataSource}
          onPageChange={(index, size) =>
            setStore((prev) => ({ ...prev, pagedOptions: { index, size } }))
          }
          columns={columns}
        />
      </ShadowCard>
      {visible && (
        <EditProjectModal
          visible={visible}
          project={project}
          onSuccess={() => {
            setVisible(false);
            setProject(undefined);
            if (dataSource) {
              const { size, page, total } = dataSource;
              gotoPage({ size, total, index: page }, 'next');
            }
          }}
          onCancel={() => {
            setVisible(false);
            setProject(undefined);
          }}
        />
      )}
      {allocVisible && project && (
        <AllocUserDrawer
          project={project}
          visible={allocVisible}
          onSuccess={() => {
            setAllocVisible(false);
            setProject(undefined);
          }}
          onClose={() => {
            setAllocVisible(false);
            setProject(undefined);
          }}
        />
      )}
    </Content>
  );
};

export default ProjectPage;

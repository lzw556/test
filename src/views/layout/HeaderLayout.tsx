import { Header } from 'antd/es/layout/layout';
import { Button, Col, Divider, Drawer, Dropdown, Row, Space, Typography } from 'antd';
import '../../App.css';
import './layout.css';
import '../../assets/iconfont.css';
import logo from '../../assets/images/logo-dark.png';
import { CaretDownOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { persistor, store } from '../../store';
import { useState } from 'react';
import dayjs from '../../utils/dayjsUtils';
import ProjectSelect from '../../components/select/projectSelect';
import { NavMenu } from './NavMenu';
import { GetMyProjectRequest } from '../../apis/project';
import { Brand } from './brand';

const { Text } = Typography;

const HeaderLayout = (props: any) => {
  const { menus } = props;
  const [currentUser] = useState<any>(store.getState().auth.data.user);
  const [now, setNow] = useState<string>(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  const [visible, setVisible] = useState(false);

  setInterval(() => {
    setNow(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }, 1000);

  const onLogout = () => {
    persistor.purge().then((_) => {
      window.location.reload();
    });
  };

  const onProjectChange = (value: any) => {
    GetMyProjectRequest(value)
      .then((data) => {
        localStorage.removeItem('store');
        store.dispatch({
          type: 'SET_PROJECT',
          payload: data.id
        });
        window.location.href = '/';
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Header className='ts-header'>
      <Row justify='start' className='pc'>
        <Col span={12}>
          <Brand
            height={36}
            brandNameStyle={{
              fontSize: '14pt',
              color: '#fff',
              letterSpacing: '2pt',
              verticalAlign: -2
            }}
          />
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Space>
            <Text style={{ color: 'white' }} strong>
              {now}
            </Text>
            {currentUser && (
              <ProjectSelect
                bordered={false}
                suffixIcon={<CaretDownOutlined style={{ color: 'white' }} />}
                onChange={onProjectChange}
              />
            )}
            <Dropdown menu={{ items: [{ key: 'logout', label: '退出登录', onClick: onLogout }] }}>
              <Space>
                <Button type={'text'} style={{ color: '#fff' }}>
                  <UserOutlined />
                  {currentUser?.username}
                </Button>
              </Space>
            </Dropdown>
          </Space>
        </Col>
      </Row>
      <div className='mobile'>
        <MenuOutlined onClick={() => setVisible(true)} />
        <div className='logo'>
          <img src={logo} width={100} alt='ThetaSensors' style={{ verticalAlign: 'middle' }} />
        </div>
        <Dropdown menu={{ items: [{ key: 'logout', label: '退出登录', onClick: onLogout }] }}>
          <UserOutlined />
        </Dropdown>
        <Drawer
          open={visible}
          placement='left'
          width='60%'
          closable={false}
          onClose={() => setVisible(false)}
          bodyStyle={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <NavMenu menus={menus} />
          <Divider />
          {currentUser && (
            <div style={{ paddingLeft: 24, paddingBottom: 100 }}>
              <ProjectSelect
                suffixIcon={<CaretDownOutlined />}
                style={{ width: '120px', textAlign: 'center' }}
                onChange={onProjectChange}
              />
            </div>
          )}
        </Drawer>
      </div>
    </Header>
  );
};

export default HeaderLayout;

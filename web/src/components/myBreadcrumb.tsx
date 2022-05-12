import { Breadcrumb, Col, Row } from 'antd';
import { FC } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { pickPathsFromLocation } from '../utils/path';
import { getMenus } from '../utils/session';
import { SecondaryRoutes } from '../routers/routes';
import { isMobile } from '../utils/deviceDetection';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { findMenu } from '../routers/helper';
import { menus_fake } from '../views/home/menus';

export interface MyBreadcrumbProps {
  children?: any;
  label?: string;
  firstBreadState?: { [propName: string]: any };
}

const flattenRoutes: any = (children: any) => {
  return children.reduce((acc: any, curr: any) => {
    acc.push(curr);
    return acc.concat(curr.children ? flattenRoutes(curr.children) : []);
  }, []);
};

const routes = flattenRoutes([...menus_fake,...getMenus()]).concat(SecondaryRoutes);

const MyBreadcrumb: FC<MyBreadcrumbProps> = ({ children, label, firstBreadState }) => {
  const location = useLocation();
  const paths = pickPathsFromLocation(location.search);

  return (
    <Row justify={'space-between'} style={{ paddingBottom: '8px' }}>
      <Col span={children ? 12 : 24}>
        <Breadcrumb style={{ fontSize: '16pt', fontWeight: 'bold' }}>
          {paths.map(({ search, name }, index: number) => {
            const menu = findMenu(routes, name, location.pathname)
            if (paths.length - 1 === index) {
              return <Breadcrumb.Item key={index}>{label ? label : menu?.title}</Breadcrumb.Item>;
            }
            return (
              <Link
                to={{
                  pathname: menu?.path,
                  search,
                  state: firstBreadState
                }}
                key={index}
              >
                {isMobile ? (
                  <ArrowLeftOutlined style={{ paddingRight: 8, fontSize: '16pt' }} />
                ) : (
                  <Breadcrumb.Item>{menu?.title}</Breadcrumb.Item>
                )}
              </Link>
            );
          })}
        </Breadcrumb>
      </Col>
      {children && (
        <Col span={12}>
          <Row justify={'end'}>
            <Col>{children}</Col>
          </Row>
        </Col>
      )}
    </Row>
  );
};

export default MyBreadcrumb;

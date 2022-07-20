import { Breadcrumb, Col, Row } from 'antd';
import { FC } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { pickPathsFromLocation } from '../utils/path';
import { getMenus } from '../utils/session';
import { SecondaryRoutes } from '../routers/routes';
import { isMobile } from '../utils/deviceDetection';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { findMenu } from '../routers/helper';

export interface MyBreadcrumbProps {
  children?: any;
  label?: string;
  firstBreadState?: { [propName: string]: any };
  fixed?: boolean;
}

const flattenRoutes: any = (children: any) => {
  return children.reduce((acc: any, curr: any) => {
    acc.push(curr);
    return acc.concat(curr.children ? flattenRoutes(curr.children) : []);
  }, []);
};

const routes = flattenRoutes(getMenus()).concat(SecondaryRoutes);

const MyBreadcrumb: FC<MyBreadcrumbProps> = ({ children, label, firstBreadState, fixed }) => {
  const location = useLocation();
  const paths = pickPathsFromLocation(location.search);

  return (
    <Row
      justify={'space-between'}
      style={
        fixed
          ? {
              position: 'fixed',
              top: 75,
              left: isMobile ? 10 : 215,
              right: 25,
              zIndex: 10,
              backgroundColor: 'rgb(238, 240, 245)'
            }
          : { paddingBottom: '8px' }
      }
    >
      <Col span={children ? 12 : 24}>
        <Breadcrumb style={{ fontSize: '16pt', fontWeight: 'bold' }}>
          {paths.map(({ search, name }, index: number) => {
            const menu = findMenu(routes, name, location.pathname);
            if (paths.length - 1 === index) {
              return <Breadcrumb.Item key={index}>{label ? label : menu?.title}</Breadcrumb.Item>;
            }
            if (isMobile) {
              <Link to={{ pathname: menu?.path, search }}>
                <ArrowLeftOutlined style={{ paddingRight: 8, fontSize: '16pt' }} />
              </Link>;
            } else {
              return (
                <Breadcrumb.Item>
                  <Link to={{ pathname: menu?.path, search }}>{menu?.title}</Link>
                </Breadcrumb.Item>
              );
            }
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

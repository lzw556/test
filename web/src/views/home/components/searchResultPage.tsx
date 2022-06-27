import { Col, Row, Space, UploadProps } from 'antd';
import * as React from 'react';
import MyBreadcrumb from '../../../components/myBreadcrumb';
import ShadowCard from '../../../components/shadowCard';

export type SearchResult = {
  actions?: JSX.Element;
  filters?: JSX.Element[];
  results: React.ReactNode;
  uploads?: UploadProps[];
};
export const SearchResultPage: React.FC<SearchResult> = (props) => {
  const { actions, filters, results } = props;
  return (
    <>
      {actions && (
        <Row>
          <Col span={24}>
            <MyBreadcrumb>
              <Space>{actions}</Space>
            </MyBreadcrumb>
          </Col>
        </Row>
      )}
      <ShadowCard>
        <Row gutter={[0, 16]}>
          {filters && (
            <Col span={8}>
              {filters.map((filter, index) => (
                <React.Fragment key={index}>{filter}</React.Fragment>
              ))}
            </Col>
          )}
          {results && <Col span={24}>{results}</Col>}
        </Row>
      </ShadowCard>
      {props.children}
    </>
  );
};

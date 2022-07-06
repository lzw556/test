import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Select, Space, Spin } from 'antd';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AssetTypes } from '../common/constants';
import { getAssets } from '../assetList/services';
import { MeasurementEdit } from './edit';
import { MeasurementRow } from '../summary/measurement/props';
import Label from '../../../components/label';
import { SearchResultPage } from '../components/searchResultPage';
import { MeasurementOfWindList } from './measurementOfWindList';
import { AssetRow } from '../assetList/props';
import { AssetEdit } from '../assetList/edit';
import { getProject } from '../../../utils/session';

const MeasurementManagement: React.FC = () => {
  const { pathname, search } = useLocation();
  const [assets, setAssets] = React.useState<{
    loading: boolean;
    items: AssetRow[];
  }>({
    loading: true,
    items: []
  });
  const local = localStorage.getItem('measurementListFilters');
  const localObj: { windTurbineId: number } = local ? JSON.parse(local) : null;
  const [filters, setFilters] = React.useState<{ windTurbineId: number } | undefined>(
    localObj ? localObj : undefined
  );
  const [wind, setWind] = React.useState<AssetRow>();
  const [visible, setVisible] = React.useState(false);
  const [visibleAsset, setVisibleAsset] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<MeasurementRow>();
  const [initialValues, setInitialValues] = React.useState(AssetTypes.WindTurbind);
  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    localStorage.setItem('prevProjectId', getProject());
    fetchAssets({ type: AssetTypes.WindTurbind.id });
  }, []);

  React.useEffect(() => {
    if (assets.items.length > 0) {
      if (filters) {
        setWind(assets.items.find((asset) => asset.id === filters.windTurbineId));
      } else {
        setWind(assets.items[0]);
      }
    }
  }, [filters, assets]);

  const open = (selectedRow?: MeasurementRow, initialValues?: typeof AssetTypes.WindTurbind) => {
    setSelectedRow(selectedRow);
    if(initialValues){
      setInitialValues(initialValues);
      setVisibleAsset(true)
    }else{
      setVisible(true);
    }
  };

  const fetchAssets = (filters?: Pick<AssetRow, 'type'>) => {
    setAssets((prev) => ({ ...prev, loading: true }));
    getAssets(filters).then((assets) => {
      setAssets({ loading: false, items: assets });
      setDisabled(assets.length === 0);
    });
  };

  const getSelectedWind = () => {
    if (assets.items.length > 0) {
      if (filters?.windTurbineId) {
        const wind = assets.items.find((asset) => asset.id === filters?.windTurbineId);
        if (wind) return wind.id;
      }
      return assets.items[0].id;
    }
  };

  const generateFilters = () => {
    return [
      <Label name='风机'>
        <Select
          bordered={false}
          onChange={(val) => {
            setFilters((prev) => ({ ...prev, windTurbineId: val }));
            localStorage.setItem('measurementListFilters', JSON.stringify({ windTurbineId: val }));
          }}
          defaultValue={getSelectedWind()}
        >
          {assets.items.map(({ id, name }) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Label>
    ];
  };

  if (assets.loading) {
    return <Spin />;
  } else if (assets.items.length === 0) {
    return (
      <Empty
        description={
          <p>
            还没有风机, 去<Link to='/asset-management?locale=asset-management'>创建</Link>
          </p>
        }
      />
    );
  }

  return (
    <SearchResultPage
      {...{
        filters: generateFilters(),
        actions: (
          <Space>
            <Button type='primary' onClick={() => open(undefined, AssetTypes.WindTurbind)}>
              添加风机
              <PlusOutlined />
            </Button>
            <Button type='primary' onClick={() => open(undefined, AssetTypes.Flange)} disabled={disabled}>
              添加法兰
              <PlusOutlined />
            </Button>
            <Button type='primary' onClick={() => open()}>
              添加监测点
              <PlusOutlined />
            </Button>
          </Space>
        ),
        results: (
          <MeasurementOfWindList
            wind={wind}
            pathname={pathname}
            search={search}
            open={open}
            fetchAssets={fetchAssets}
          />
        )
      }}
    >
      {visible && (
        <MeasurementEdit
          {...{
            visible,
            onCancel: () => setVisible(false),
            id: selectedRow?.id,
            assetId: filters?.windTurbineId,
            onSuccess: () => {
              fetchAssets({ type: AssetTypes.WindTurbind.id });
              setVisible(false);
            }
          }}
        />
      )}
      {visibleAsset && (
        <AssetEdit
          {...{
            visible: visibleAsset,
            onCancel: () => setVisibleAsset(false),
            initialValues,
            onSuccess: () => {
              fetchAssets({ type: AssetTypes.WindTurbind.id });
              setVisibleAsset(false);
            }
          }}
        />
      )}
    </SearchResultPage>
  );
};

export default MeasurementManagement;

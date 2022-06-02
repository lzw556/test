import { Empty, Spin } from 'antd';
import Item from 'antd/lib/list/Item';
import moment from 'moment';
import * as React from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { LineChartStyles } from '../../../constants/chart';
import { AssetNavigator } from '../assetNavigator';
import { MeasurementTypes } from '../constants';
import '../home.css';
import { MeasurementRow } from '../measurement/props';
import { getData } from '../measurement/services';
import { OverviewPage } from '../overviewPage';
import { TableListItem, NameValue } from '../props';
import {
  generateColProps,
  generateFlangeChartOptions,
  transformMeasurementHistoryData,
  transformSingleMeasurmentData
} from '../utils';
import { AssetRow, generatePreloadOptions, transformAssetStatistics } from './props';
import { getAsset } from './services';

const FlangeOverview: React.FC = () => {
  const { search } = useLocation();
  const history = useHistory();
  const id = Number(search.substring(search.lastIndexOf('id=') + 3));
  const [asset, setAsset] = React.useState<AssetRow>();
  const [loading, setLoading] = React.useState(true);
  const [measurements, setMeasurements] = React.useState<MeasurementRow[]>();
  const [statistics, setStatistics] = React.useState<NameValue[]>();
  const [statisticOfPreload, setStatisticOfPreload] = React.useState<any>();
  const [tableOfMeasurement, setTableOfMeasurement] = React.useState<TableListItem<MeasurementRow>>(
    {
      rowKey: 'id',
      title: () => <h3>当前数据</h3>,
      columns: [
        {
          title: '监测点',
          dataIndex: 'name',
          key: 'name',
          render: (name: string, row: MeasurementRow) => (
            <Link to={`${MeasurementTypes.dynamicPreload.url}&id=${row.id}`}>{name}</Link>
          ),
          width: 200
        },
        { title: '状态', dataIndex: 'state', key: 'state', render: () => '正常', width: 120 }
      ],
      colProps: generateColProps({ xl: 24, xxl: 24 }),
      size: 'small',
      pagination: false
    }
  );
  React.useEffect(() => {
    getAsset(id).then((asset) => {
      setLoading(false);
      setAsset(asset);
    });
  }, [id]);
  React.useEffect(() => {
    if (asset) {
      const { statistics, monitoringPoints } = asset;
      setStatistics(
        transformAssetStatistics(
          statistics,
          'monitoringPointNum',
          ['danger', '紧急报警监测点'],
          ['warn', '重要报警监测点'],
          ['info', '次要报警监测点'],
          'deviceNum',
          'offlineDeviceNum'
        ).statistics
      );
      setMeasurements(monitoringPoints);
      if (monitoringPoints && monitoringPoints.length > 0) {
        setTableOfMeasurement((prev) => {
          if (prev.columns) {
            return {
              ...prev,
              columns: [...prev.columns, ...transformSingleMeasurmentData(monitoringPoints[0])],
              dataSource: monitoringPoints
            };
          } else {
            return prev;
          }
        });
      }
    }
  }, [asset]);

  React.useEffect(() => {
    if (measurements && measurements.length > 0) {
      const from = moment().startOf('day').subtract(7, 'd').utc().unix();
      const to = moment().endOf('day').utc().unix();
      if (!statisticOfPreload) {
        getData(measurements[0].id, from, to).then((data) => {
          if (data.length > 0) {
            const datas = transformMeasurementHistoryData(data, 'preload');
            if (datas.length > 0) {
              setStatisticOfPreload(generatePreloadOptions(datas[0], measurements[0].name));
            }
          }
        });
      } else if (
        statisticOfPreload.series &&
        statisticOfPreload.series.length &&
        statisticOfPreload.series.length !== measurements.length
      ) {
        measurements
          .filter((item) => item.id !== measurements[0].id)
          .forEach(({ id, name }) => {
            getData(id, from, to).then((data) => {
              if (data.length > 0) {
                const datas = transformMeasurementHistoryData(data, 'preload');
                if (datas.length > 0) {
                  setStatisticOfPreload((prev: any) => ({
                    ...prev,
                    series: prev.series.concat(
                      datas[0].seriesData.map(({ data }: any, index: any) => ({
                        type: 'line',
                        name,
                        areaStyle: LineChartStyles[statisticOfPreload.series.length].areaStyle,
                        data
                      }))
                    )
                  }));
                }
              }
            });
          });
      }
    }
  }, [measurements, statisticOfPreload]);

  if (loading) return <Spin />;
  //TODO
  if (!measurements || measurements.length === 0)
    return (
      <Empty
        description={
          <p>
            还没有监测点, 去
            <Link to='/measurement-management?locale=measruement-management'>创建</Link>, 或
            <a
              href='#!'
              onClick={(e) => {
                history.goBack();
                e.preventDefault();
              }}
            >
              返回
            </a>
          </p>
        }
      />
    );

  return (
    <>
      <AssetNavigator id={id} type={asset?.type} />
      <OverviewPage
        {...{
          statistics,
          tabelList: [tableOfMeasurement],
          chartList: [
            {
              title: '分布图',
              colProps: generateColProps({ xl: 12, xxl: 9 }),
              options: generateFlangeChartOptions(measurements, {
                inner: '55%',
                outer: '70%'
              })
            },
            {
              title: '预紧力趋势',
              colProps: generateColProps({ xl: 12, xxl: 15 }),
              options: statisticOfPreload
            }
          ]
        }}
      />
    </>
  );
};

export default FlangeOverview;
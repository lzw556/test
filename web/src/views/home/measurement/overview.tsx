import { TableProps } from 'antd';
import * as React from 'react';
import { useLocation } from 'react-router-dom';
import MyBreadcrumb from '../../../components/myBreadcrumb';
import { Series_Bar } from '../charts/bar';
import { ChartOptions } from '../charts/common';
import '../home.css';
import { OverviewPage } from '../overviewPage';
import { Overview, TableListItem } from '../props';

const MeasurementOverview: React.FC = () => {
  const { search } = useLocation();
  const id = Number(search.substring(search.lastIndexOf('id=') + 3));
  const [overview, setOverview] = React.useState<Overview>();
  React.useEffect(() => {
    const colProps = {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      xl: { span: 12 },
      xxl: { span: 9 }
    };
    const colProps2 = {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      xl: { span: 12 },
      xxl: { span: 15 }
    };
    const colProps3 = {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      xl: { span: 12 },
      xxl: { span: 15 }
    };
    const colProps4 = {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      xl: { span: 12 },
      xxl: { span: 9 }
    };

    const statisticOfPreload: ChartOptions<Series_Bar> = {
      title: {
        text: '',
        left: 'center'
      },
      legend: { bottom: 0 },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['2022-03-08', '2022-03-09', '2022-03-10'] },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          name: '严重',
          data: [1, 2, 3]
        },
        {
          type: 'bar',
          name: '次要',
          data: [3, 2, 1]
        }
      ]
    };
    const getStatisticOfFlange = () => {
      const sensorCountPerFlange = 6;
      const interval = 360 / sensorCountPerFlange;
      const valuesReal = [];
      const valuesBg = [];
      for (let index = sensorCountPerFlange; index >= 0; index--) {
        valuesReal.push([300 + Math.random() * 20, interval * index]);
        valuesBg.push([1, interval * index]);
      }
      const valuesSensor = valuesBg.map((item, index) => ({
        name: `item${index}`,
        value: item,
        label: {
          show: true,
          color: '#fff',
          formatter: (paras: any) => {
            return paras.data.value[1] / interval;
          }
        }
      }));
      const valuesRule = [];
      const max = 600;
      const count = 360;
      for (let index = count; index >= 0; index = index - 3) {
        valuesRule.push([max, (360 / count) * index]);
      }
      return {
        polar: [
          { id: 'inner', radius: '55%' },
          { id: 'outer', radius: '70%' }
        ],
        angleAxis: [
          {
            type: 'value',
            polarIndex: 0,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false }
          },
          {
            type: 'value',
            polarIndex: 1,
            startAngle: 360 / sensorCountPerFlange + 90,
            axisLine: { show: true, lineStyle: { type: 'dashed' } },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false }
          }
        ],
        radiusAxis: [
          {
            polarIndex: 0,
            max: 700,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#ccc' }
          },
          {
            polarIndex: 1,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitLine: { show: false }
          }
        ],
        legend: {
          data: [
            {
              name: '实际值'
            },
            {
              name: '规定值'
            }
          ],
          bottom: 0
        },
        series: [
          {
            type: 'line',
            name: '实际值',
            coordinateSystem: 'polar',
            data: valuesReal
          },
          {
            type: 'line',
            name: '规定值',
            coordinateSystem: 'polar',
            data: valuesRule,
            symbol: 'none',
            lineStyle: { type: 'dashed' }
          },
          {
            type: 'scatter',
            name: 'bg',
            coordinateSystem: 'polar',
            polarIndex: 1,
            symbol:
              'path://M675.9 107.2H348.1c-42.9 0-82.5 22.9-104 60.1L80 452.1c-21.4 37.1-21.4 82.7 0 119.8l164.1 284.8c21.4 37.2 61.1 60.1 104 60.1h327.8c42.9 0 82.5-22.9 104-60.1L944 571.9c21.4-37.1 21.4-82.7 0-119.8L779.9 167.3c-21.4-37.1-61.1-60.1-104-60.1z',
            symbolSize: 30,
            data: valuesSensor,
            itemStyle: {
              opacity: 1,
              color: '#555'
            }
          }
        ]
      };
    };
    const statisticOfFlange: any = getStatisticOfFlange();
    type Sensor = {
      id: number;
      name: string;
      state: string;
      preload: string;
    };
    const sensors: Sensor[] = [];
    for (let index = 0; index < 5; index++) {
      sensors.push({ id: index, name: `监测点${index}`, state: '正常', preload: '100' });
    }
    const tableOfSensors: TableListItem<Sensor> = {
      rowKey: 'id',
      title: () => <h3>当前数据</h3>,
      columns: [
        { title: '监测点', dataIndex: 'name', key: 'name' },
        { title: '状态', dataIndex: 'state', key: 'state' },
        { title: '预紧力', dataIndex: 'preload', key: 'preload' }
      ],
      dataSource: sensors,
      colProps: colProps3,
      size: 'small',
      pagination: false
    };
    const tableOfSensors2: TableListItem<Sensor> = {
      rowKey: 'id',
      title: () => <h3>最近事件</h3>,
      columns: [
        { title: '监测点', dataIndex: 'name', key: 'name' },
        { title: '状态', dataIndex: 'state', key: 'state' },
        { title: '预紧力', dataIndex: 'preload', key: 'preload' }
      ],
      dataSource: sensors,
      colProps: colProps4,
      size: 'small',
      pagination: false
    };
    setOverview({
      properties: [
        { name: '监测螺栓数量', value: 4 },
        { name: '异常螺栓数量', value: 4 },
        { name: '最大预紧力', value: '400kN' },
        { name: '最新预紧力', value: '300kN' }
      ],
      chartList: [
        { title: '分布图', colProps, options: statisticOfFlange },
        {
          title: '预紧力趋势',
          colProps: colProps2,
          options: statisticOfPreload
        }
      ],
      tabelList: [tableOfSensors, tableOfSensors2]
    });
  }, [id]);

  if (!overview) return null;

  return (
    <>
      <MyBreadcrumb />
      <OverviewPage {...overview} />
    </>
  );
};

export default MeasurementOverview;

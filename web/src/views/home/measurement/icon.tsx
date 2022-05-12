import Icon from '@ant-design/icons';
import React from 'react';
import { ReactComponent as Flange } from './flange.svg';

export const MeasurementIcon = () => {
  return (
    <Icon component={() => <Flange height={30} width={30} fill='#fff' className='icon-svg' />} />
  );
};

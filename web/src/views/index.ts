import {lazy} from 'react';

export const Login = lazy(() => import('./login'))
export const Console = lazy(() => import('./console'))
export const Dashboard = lazy(() => import('./dashboard'))
export const Asset = lazy(() => import('./asset'))
export const Device = lazy(() => import('./device'))
export const DeviceDetail = lazy(() => import('./device/detail'))
export const AddDevice = lazy(() => import('./device/add'))
export const Network = lazy(() => import('./network'))
export const HistoryData = lazy(() => import('./data/history'))
export const AlarmRecord = lazy(() => import('./alarm/record'))
export const AlarmRule = lazy(() => import('./alarm/rule'))
export const AddAlarmRule = lazy(() => import('./alarm/rule/add'))
export const AddAlarmRuleTemplate = lazy(() => import('./alarm/rule/template/add'))
export const EditAlarmRuleTemplate = lazy(() => import('./alarm/rule/template/edit'))
export const ImportNetwork = lazy(() => import('./network/import'))
export const Firmware = lazy(() => import('./firmware'))
export const User = lazy(() => import('./user'))
export const Me = lazy(() => import('./me'))
export const System = lazy(() => import('./system'))

export const NotFound = lazy(() => import('./404'))
export const ServerError = lazy(() => import('./500'))
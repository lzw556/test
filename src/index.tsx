import ReactDOM from 'react-dom';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { StoreContext } from 'redux-react-hook';
import AppRouter from './routers';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { AssetCategoryProvider } from './views/asset/components/assetCategoryContext';

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConfigProvider locale={zhCN}>
        <AssetCategoryProvider>
          <AppRouter />
        </AssetCategoryProvider>
      </ConfigProvider>
    </PersistGate>
  </StoreContext.Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

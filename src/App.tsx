import { Provider } from 'react-redux';
import './App.css';
import Routers from './routers/Routers';
import store from './redux/store';
import { ConfigProvider } from 'antd';

function App() {
  return (
    <ConfigProvider theme={{token: {}, components: {}}}>
      <Provider store={store}>
        <Routers/>
      </Provider>
    </ConfigProvider>
  );
}

export default App;

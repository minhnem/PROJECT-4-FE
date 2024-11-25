import { Provider } from 'react-redux';
import './App.css';
import Routers from './routers/Routers';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <Routers/>
    </Provider>
  );
}

export default App;

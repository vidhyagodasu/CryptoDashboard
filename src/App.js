import CryptoDataProvider from './Components/CryptoDataProvider/CryptoDataProvider';
import Dashboard from './Components/DashBoard/DashBoard';

function App() {
  return (
    <CryptoDataProvider>
      <Dashboard />
    </CryptoDataProvider>
  );
}

export default App;

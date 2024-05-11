
import './App.css';
import Layout from './layout/Layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './page/Login';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Layout />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Pengguna from './pages/Pengguna'; 
import Laporan from './pages/Laporan';  
// import Kategori from './pages/Kategori'; 

const App = () => {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <Routes>
          <Route path="/pengguna" element={<Pengguna />} />
          {/* <Route path="/kategori" element={<Kategori/>} /> */}
          <Route path="/" element={<Laporan />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


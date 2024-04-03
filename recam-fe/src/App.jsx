import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HeaderComponent from './component/template/Header';
import FooterComponent from './component/template/Footer';
import SidebarComponent from './component/template/Sidebar';
import Home from './component/recams/Home';
import Kamera from './component/recams/Kamera';
import AddCamera from './component/recams/AddCamera';

function App() {
  return (
    <BrowserRouter>
      <div id="wrapper">
        <SidebarComponent />
        <div id="content-wrapper" className="d-flex flex-column">
          <HeaderComponent />
          <div className="container-fluid">
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/list' element={<Kamera />} />
              <Route path='/add-camera' element={<AddCamera />} />
            </Routes>
          </div>
          <div className="container my-auto"/>
          <FooterComponent />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

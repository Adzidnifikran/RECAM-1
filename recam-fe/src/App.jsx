import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HeaderComponent from './component/template/Header';
import FooterComponent from './component/template/Footer';
import SidebarComponent from './component/template/Sidebar';
import Home from './component/recams/Home';
import AddCamera from './component/recams/AddCamera';
import UpdateCamera from './component/recams/UpdateCamera';
import ListKamera from './component/recams/ListKamera';
import ListTransaksi from './component/recams/ListTransaksi';
import AddRent from './component/recams/AddRent';

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
              <Route path='/list' element={<ListKamera />} />
              <Route path='/listrental' element={<ListTransaksi/>}/>
              <Route path='/add-rent' element={<AddRent/>}/>
              <Route path='/add-camera' element={<AddCamera />} />
              <Route path='/update-camera/:id' element={<UpdateCamera />} />
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

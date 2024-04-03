import { useState } from 'react'
import './App.css'
import {Routes, Route,BrowserRouter} from 'react-router-dom'
import HeaderComponent from './component/template/Header'
import FooterComponent from './component/template/Footer'
import SidebarComponent from './component/template/Sidebar'
import CobaComponent from './component/recams/coba'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <HeaderComponent/>
      <SidebarComponent/>
      <Routes>
        <Route path='/' element= { <CobaComponent/>}></Route>
      </Routes>
      <FooterComponent/>
    </BrowserRouter>
    </>
  )
}

export default App

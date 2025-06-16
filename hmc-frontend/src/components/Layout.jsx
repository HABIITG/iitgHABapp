import React from 'react'
import './Layout.css'
import SideBar from './SideBar'
import NavBar from './NavBar'
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <NavBar />
      <div>
        <SideBar />
      </div>
      <div className='content'>
        {children}
      </div>
    </div>
  )
}

export default Layout
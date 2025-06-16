import React from 'react'
import { NavLink } from 'react-router-dom'
import './SideBar.css'
const SideBar = () => {
  return (
    <div className='sidebar'>
        <ul className='sidebar-list'>
            <li className='sidebar-item'><NavLink to="/" className={({isActive})=>isActive ? 'side-nav active' : 'side-nav passive'}>Home</NavLink></li>
            <li className='sidebar-item'><NavLink to="/hostels" className={({isActive})=>isActive ? 'side-nav active' : 'side-nav passive'}>Hostels</NavLink></li>
            <li className='sidebar-item'><NavLink to="/mess" className={({isActive})=>isActive ? 'side-nav active' : 'side-nav passive'}>Mess</NavLink></li>
            <li className='sidebar-item'><NavLink to="/statisticscomplaints" className={({isActive})=>isActive ? 'side-nav active' : 'side-nav passive'}>Statistics Complaints</NavLink></li>
        </ul>
    </div>
  )
}

export default SideBar
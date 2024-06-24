import React from 'react';
import logo from '../assets/images/logohlify.png';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';

const Sidebar = () => {
  return (
    <>
        <div className='sidebar'>
            <img src= {logo} alt="Logo" className="logo"/>
            <nav className='navbar'>
                <ul className='navbar-item'>
                    {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </div>
    </>
  )
}

export default Sidebar;


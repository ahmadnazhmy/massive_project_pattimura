import React from "react";
import documentsIcon from '../assets/icons/documents_icon.png';
import vectorIcon from '../assets/icons/vector_icon.png';
import profileIcon from '../assets/icons/profile_icon.png';
import logoutIcon from '../assets/icons/logout_icon.png'

export const SidebarData = [
    {
        title: 'Laporan',
        path: '/',
        icon: <img src={documentsIcon} alt="Documents Icon" />,
        cName: 'nav-text'
    },

    // {
    //     title: 'Kategori',
    //     path: '/kategori',
    //     icon: <img src={vectorIcon} alt="Vector Icon" />,
    //     cName: 'nav-text'
    // },

    {
        title: 'Pengguna',
        path: '/pengguna',
        icon: <img src={profileIcon} alt="Profile Icon" />,
        cName: 'nav-text'
    },

    // {
    //     title: 'Log Out',
    //     path: '/',
    //     icon: <img src={logoutIcon} alt="Logout Icon" />,
    //     cName: 'nav-text'
    // }
]

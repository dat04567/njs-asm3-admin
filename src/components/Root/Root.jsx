import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Menu from '../Menu/Menu';

const Root = () => {
   return (
      <div className="App">
            <div
               id="main-wrapper"
               data-theme="light"
               data-layout="vertical"
               data-navbarbg="skin6"
               data-sidebartype="full"
               data-sidebar-position="fixed"
               data-header-position="fixed"
               data-boxed-layout="full">
               <Header />

               <Menu />
               <Outlet />
            </div>
      </div>
   );
};

export default Root;

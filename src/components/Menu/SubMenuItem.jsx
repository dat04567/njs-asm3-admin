import React , { useEffect} from 'react';
import { NavLink, useLocation } from 'react-router-dom';
function SubMenuItem({path, setClick, name}) {
   const location = useLocation();
   const isActive = location.pathname === path;
   
   useEffect(() => {
      if (isActive) {
        setClick(isActive);
      }
    }, [isActive, setClick]);

   return (
      <NavLink className="sidebar-item" to={path}>
         {({ isActive }) => {
            return (
               <div className={`sidebar-link ${isActive && 'active'}`}>
                  <span className="hide-menu">{name}</span>
               </div>
            );
         }}
      </NavLink>
   );
}

export default SubMenuItem;

import React , {useEffect, useMemo} from 'react';
import { NavLink, useLocation } from 'react-router-dom';
function MenuItem({ setClick, children, to }) {
   const location = useLocation();
   const isActive =  useMemo(  () => location.pathname === to, [ location.pathname , to]);
   useEffect(() => {
      if (isActive) {
         setClick(false);
      }
   }, [isActive, setClick]);
   return (
      <NavLink
         to={to}
         className={(navData) => {
            return navData.isActive ? 'sidebar-item selected' : 'sidebar-item';
         }}>
         <div className={`sidebar-link sidebar-link active`}>{children}</div>
      </NavLink>
   );
}

export default MenuItem;

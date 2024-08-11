import React, { useState, useEffect } from 'react';
import { Grid, Home, Lock, MessageSquare, Settings, LogOut } from 'react-feather';
import { useLocation } from 'react-router-dom';
import './Menu.css';
import SubMenuItem from './SubMenuItem';
import { useSelector , useDispatch} from 'react-redux';
import MenuItem from './MenuItem';
import { logout } from '../../slices/auth';
import {useNavigate} from 'react-router-dom'


function Menu(props) {
   const [isActive, setActive] = useState(false);
   const [isClick, setClick] = useState(false);
   const location = useLocation();
   const { isLoggedIn, user } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   const navigate = useNavigate();
  
   const handleLogout = async () => {
      try {
         await dispatch(logout()).unwrap();
         navigate('/login')
      } catch (error) {
         console.log(error);  
      }

   };
   useEffect(() => {
      if (
         location.pathname === '/products' ||
         location.pathname === '/users' ||
         location.pathname === '/history'
      ) {
         setClick(true);
         setActive(true);
      }
   }, [location.pathname]);

   
   return (
      <aside className="left-sidebar" data-sidebarbg="skin6">
         <div className="scroll-sidebar" data-sidebarbg="skin6">
            <nav className="sidebar-nav">
               <ul id="sidebarnav">
                  {isLoggedIn && (
                     <>
                        {user.role === 'admin' && (
                           <>
                              <MenuItem setClick={setClick} to="/">
                                 <Home className="feather-icon" />
                                 <span className="hide-menu">Dashboard</span>
                              </MenuItem>
                              <li className="list-divider"></li>

                              <li className="nav-small-cap">
                                 <span className="hide-menu">Components</span>
                              </li>
                              <MenuItem setClick={setClick} to="/new">
                                 <Settings className="feather-icon" />
                                 <span className="hide-menu">New Product</span>
                              </MenuItem>
                           </>
                        )}

                        <MenuItem setClick={setClick} to="/chat">
                           <MessageSquare className="feather-icon" />
                           <span className="hide-menu">Customer</span>
                        </MenuItem>

                        {user.role === 'admin' && (
                           <>
                              <li className={`sidebar-item ${isClick ? 'selected' : ''}`}>
                                 <button
                                    className={`sidebar-link has-arrow btn-menu ${
                                       isActive && 'active'
                                    }`}
                                    onClick={() => setActive(!isActive)}>
                                    <Grid className="feather-icon" />
                                    <span className="hide-menu">Tables</span>
                                 </button>
                                 {isActive && (
                                    <div className="collapse first-level base-level-line in">
                                       <SubMenuItem
                                          setClick={setClick}
                                          path="/users"
                                          name="Users"
                                       />
                                       <SubMenuItem
                                          setClick={setClick}
                                          path="/products"
                                          name="Products"
                                       />
                                       <SubMenuItem
                                          setClick={setClick}
                                          path="/history"
                                          name="History"
                                       />
                                    </div>
                                 )}
                              </li>
                           </>
                        )}
                     </>
                  )}

                  <li className="list-divider"></li>

                  {!isLoggedIn ? (
                     <>
                        <li className="nav-small-cap">
                           <span className="hide-menu">Authentication</span>
                        </li>

                        <MenuItem setClick={setClick} to="/login">
                           <Lock className="feather-icon" />
                           <span className="hide-menu">Login</span>
                        </MenuItem>
                     </>
                  ) : (
                     <>
                        <li className="nav-small-cap">
                           <span className="hide-menu">Authentication</span>
                        </li>

                        <button className="sidebar-item border-0  bg-white" onClick={handleLogout}>
                           <div className="sidebar-link sidebar-link active">
                              <LogOut className="feather-icon" />
                              <span className="hide-menu">Logout</span>
                           </div>
                        </button>

                     </>
                  )}
               </ul>
            </nav>
         </div>
      </aside>
   );
}

export default Menu;

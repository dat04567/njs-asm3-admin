import React, { useEffect, useState } from 'react';
import { ChatRoomsAPI } from '../../API';
import './Chat.css';
import { Outlet } from 'react-router-dom';
import socketService from '../../service/socket.service';
import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../../slices/auth';
// ;

function Chat(props) {
   const [allRoom, setAllRoom] = useState([]);
   const {  isLoggedIn } = useSelector((state) => state.auth);
   const dispatch = useDispatch();
   // Hàm này dùng để tìm ra những user khác với admin
   useEffect(() => {
      const fetchData = async () => {
         try {
            const result = await ChatRoomsAPI.getAllRoom();
            console.log(result.data);
            setAllRoom(result.data);
         } catch (error) {
            if (error.data.expired) {
               dispatch(removeUser());
            }
         }
      };
      fetchData();
   }, [dispatch]);


   // //Hàm này dùng để nhận socket từ server gửi lên
   useEffect(() => {
      const socket = socketService.connect(null, true);
      socket.emit('join', 'aa');
      socket.on('newRoom', (data) => {
         setAllRoom(data.rooms);
      });

      return () => {
         socket.off('newRoom');
         socket.disconnect();
      };
   }, []);

   if (!isLoggedIn) {
      return <Navigate to="/login" />;
   }

   return (
      <div className="page-wrapper d-block">
         <div className="page-breadcrumb">
            <div className="row">
               <div className="col-7 align-self-center">
                  <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
                     Chat
                  </h4>
                  <div className="d-flex align-items-center">
                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb m-0 p-0">
                           <li className="breadcrumb-item text-muted active" aria-current="page">
                              Apps
                           </li>
                           <li className="breadcrumb-item text-muted" aria-current="page">
                              Chat
                           </li>
                        </ol>
                     </nav>
                  </div>
               </div>
            </div>
         </div>
         <div className="container-fluid">
            <div className="row">
               <div className="col-md-12">
                  <div className="card">
                     <div className="row no-gutters">
                        <div className="col-lg-3 col-xl-2 border-right">
                           <div className="card-body border-bottom">
                              <form>
                                 <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Search Contact"
                                 />
                              </form>
                           </div>
                           <div
                              className="scrollable position-relative"
                              style={{ height: 'calc(80vh - 111px)' }}>
                              <ul className="mailbox list-style-none">
                                 <li>
                                    <div className="message-center">
                                       {allRoom.map((value) => (
                                          <Link
                                             key={value._id}
                                             to={`/chat/${value._id}`}
                                             className="message-item d-flex align-items-center border-bottom px-3 py-2 active_user">
                                             <div className="user-img">
                                                <img
                                                   src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                                   alt="user"
                                                   className="img-fluid rounded-circle"
                                                   width="40px"
                                                />
                                                <span className="profile-status away float-right"></span>
                                             </div>
                                             <div className="w-75 d-inline-block v-middle pl-2">
                                                <h6 className="message-title mb-0 mt-1">
                                                   {value._id}
                                                </h6>
                                             </div>
                                          </Link>
                                       ))}
                                    </div>
                                 </li>
                              </ul>
                           </div>
                        </div>
                        <Outlet />
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <footer className="footer text-center"></footer>
      </div>
   );
}

export default Chat;

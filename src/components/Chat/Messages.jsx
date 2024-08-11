import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import { ChatRoomsAPI } from '../../API';
import socketService from '../../service/socket.service';
import { useCallback } from 'react';
function Message() {
   const { roomId } = useParams();
   const { rooms } = useLoaderData();
   const [message, setMessage] = useState([]);
   const [textMessage, setTextMessage] = useState('');
   const chatBoxRef = useRef(null);
   const naviagte = useNavigate();

   const onChangeText = useCallback( (e) => {
      setTextMessage(e.target.value);
   },[]);

   const handlerSend = useCallback( async () => {
      const data = {
         message: textMessage,
         roomId: roomId,
         sender: 'admin',
         receiver: 'client',
      };
      try {
         await ChatRoomsAPI.addMessage(data);

         setTextMessage('');
      } catch (error) {}
   },[textMessage, roomId]);

   useEffect(() => {
      setMessage(rooms || []);
   }, [rooms]);

   useEffect(() => {
      const socket = socketService.connect(roomId, null);
      socket.on('newMessage', ({ messages }) => {
         if (messages.isEnd) {
            setMessage([]);
            naviagte('/chat');
            return;
         }
         setMessage(messages.data);
      });

      return () => {
         socket.off('newMessage');
      };
   }, [roomId, naviagte]);

   useEffect(() => {
      // Cuộn xuống cuối danh sách tin nhắn mỗi khi danh sách thay đổi
      if (chatBoxRef.current) {
         chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
   }, [message]);

   return (
      <div className="col-lg-9  col-xl-10">
         <div
            className="chat-box scrollable position-relative"
            style={{ height: 'calc(80vh - 111px)' }}
            ref={chatBoxRef}>
            <ul className="chat-list list-style-none px-3 pt-3">
               {message.map((value) =>
                  value.sender === 'admin' ? (
                     <li className="chat-item odd list-style-none mt-3" key={value._id}>
                        <div className="chat-content text-right d-inline-block pl-3">
                           <div className="box msg p-2 d-inline-block mb-1">
                              You: {value.message}
                           </div>
                           <br />
                        </div>
                     </li>
                  ) : (
                     <li className="chat-item list-style-none mt-3" key={value._id}>
                        <div className="chat-img d-inline-block">
                           <img
                              src="https://img.icons8.com/color/36/000000/administrator-male.png"
                              alt="user"
                              className="rounded-circle"
                              width="45"
                           />
                        </div>
                        <div className="chat-content d-inline-block pl-3">
                           <h6 className="font-weight-medium">{value.name}</h6>
                           <div className="msg p-2 d-inline-block mb-1">
                              Client: {value.message}
                           </div>
                        </div>
                        <div className="chat-time d-block font-10 mt-1 mr-0 mb-3"></div>
                     </li>
                  )
               )}
            </ul>
         </div>
         <div className="card-body border-top">
            <div className="row">
               <div className="col-9">
                  <div className="input-field mt-0 mb-0">
                     <input
                        id="textarea1"
                        placeholder="Type and enter"
                        className="form-control border-0"
                        type="text"
                        onChange={onChangeText}
                        value={textMessage}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              handlerSend();
                           }
                        }}
                     />
                  </div>
               </div>
               <div className="col-3">
                  <a
                     href="/#"
                     className="btn-circle btn-lg btn-cyan float-right text-white"
                     onClick={handlerSend}>
                     <i className="fas fa-paper-plane"></i>
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Message;

export async function loader({ params }) {
   const roomId = params.roomId;
   try {
      const result = await ChatRoomsAPI.getMessageByRoomId(roomId);
      return {
         rooms: result.data,
      };
   } catch (error) {
      console.log(error);
      return [];
   }
}

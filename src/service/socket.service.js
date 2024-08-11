import io from 'socket.io-client';

//window.location.hostname
function connect(roomId, isAdmin) {
   const socket = io(process.env.REACT_APP_API_SERVER, {
      query: {
         roomId,
         isAdmin,
      },
   });
   return socket;
}

const socketService = {
   connect,
};

export default socketService;

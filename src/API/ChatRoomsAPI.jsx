import axiosClient from './axiosClient';

const ChatRoomsAPI = {
	getMessageByRoomId: (roomId) => {
		const url = `/chat/getMessagesForRoom?roomId=${roomId}`;
		return axiosClient.get(url);
	},

	createNewRoom: () => {
		const url = `/chatrooms/createNewRoom`;
		return axiosClient.post(url);
	},

	addMessage: (body) => {
		const url = `/chat/sendMessage`;
		return axiosClient.put(url, body);
	},

	getAllRoom: () => {
		const url = `/chat/getAllRoom`;
		return axiosClient.get(url);
	}
};

export default ChatRoomsAPI;

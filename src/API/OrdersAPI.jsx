import axiosClient from './axiosClient';

const OrdersAPI = {
	getOrders : () => {
		return axiosClient.get("/admin/orders");
	}
};

export default OrdersAPI;

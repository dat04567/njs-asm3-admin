import axiosClient from './axiosClient';

const ProductAPI = {
   getAPI: (data) => {
      console.log(data);
      
      const url = `/products${data}`;
      return axiosClient.get(url);
   },

   getDetail: (id) => {
      const url = `/products/${id}`;
      return axiosClient.get(url);
   },

   updateProduct: (data, id) => {
      const url = `/products/${id}`;
      return axiosClient.patch(url, data);
   },

   addProduct: (data) => {
      const url = '/products';
      return axiosClient.put(url, data);
   },

   deleteProduct: (id, page) => {
      const url = `/products/${id}?page=${page}`;
      return axiosClient.delete(url);
   },

};

export default ProductAPI;

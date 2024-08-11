import Cookies from 'js-cookie';
import axiosClient from '../API/axiosClient';
import alertify from 'alertifyjs';
import axios from 'axios';
import { redirect } from 'react-router-dom';

const API_URL = `${process.env.REACT_APP_API_SERVER}/auth/`;

const register = (body) => {
   return axios.put(API_URL + 'signup', body);
};

const login = (email, password) => {
   console.log(API_URL);

   return axios
      .post(API_URL + 'login', {
         email,
         password,
         page: 'admin',
      })
      .then((response) => {
         console.log(response.data);

         if (response.data.accessToken) {
            Cookies.set('user', JSON.stringify(response.data), {
               expires: 7,
               sameSite: 'strict',
            }); // Expires in 7 days
         }
         return response.data;
      });
};

const getUser = () => {
   return Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
};

const logout = () => {
   const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
   const refreshToken = user?.refreshToken;
   return axiosClient.post(API_URL + 'logout', { refreshToken: refreshToken }).then((response) => {
      alertify.set('notifier', 'position', 'bottom-left');
      alertify.success('Đăng Xuất Thành Công!');
      Cookies.remove('user');
      return response.status;
   });
};

const checkAuth = () => {
   const user = AuthService.getUser();
   if (!user) {
      return redirect('/login');
   }
   if (user && user.role === 'staff') {
      return redirect('/chat');
   }
   return null;
};

const removeUser = () => {
   alertify.set('notifier', 'position', 'bottom-left');
   alertify.error('Phiên Đăng Nhập Hết Hạn, Vui Lòng Đăng Nhập Lại!');
   Cookies.remove('user');
};

const getLocalRefreshToken = () => {
   const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
   return user?.refreshToken;
};

const getLocalAccessToken = () => {
   const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
   return user?.accessToken;
};

const updateLocalAccessToken = (token) => {
   let user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};
   user.accessToken = token;
   Cookies.set('user', JSON.stringify(user), {
      expires: 7,
      sameSite: 'strict',
   }); // Expires in 7 days
};

const AuthService = {
   register,
   login,
   logout,
   getUser,
   removeUser,
   getLocalRefreshToken,
   getLocalAccessToken,
   updateLocalAccessToken,
   checkAuth,
};
export default AuthService;

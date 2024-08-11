// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
import { removeUser } from '../slices/auth';
import AuthService from '../service/auth.service';
// Set up default config for http requests here
// Please have a look at here `https://github.com/axios/axios#requestconfig` for the full list of configs


const axiosClient = axios.create({
	baseURL: process.env.REACT_APP_API_SERVER,
	paramsSerializer: (params) => queryString.stringify(params),
});


axiosClient.interceptors.request.use(
	(config) => {
	  const token = AuthService.getLocalAccessToken();
	  if (token) {
		 config.headers["Authorization"] = 'Bearer ' + token; 
	  }
	  return config;
	},
	(error) => {
	  return Promise.reject(error);
	}
 );


 axiosClient.interceptors.response.use(
	(res) => {
	  return res;
	},
	async (err) => {
	  const originalConfig = err.config;
	  if (originalConfig.url !== "/auth/login" && err.response) {
		 // Access Token was expired 
		 if (err.response.status === 401 && !originalConfig._retry) {
			originalConfig._retry = true;

			try {
			  const rs = await axiosClient.post("/auth/refreshtoken", {
				 refreshToken: AuthService.getLocalRefreshToken(),
			  });
 
			  const { accessToken } = rs.data;
			  AuthService.updateLocalAccessToken(accessToken);
			  
			  return axiosClient(originalConfig);
			} catch (_error) {
				if(_error?.data.expired) {
					originalConfig._retry = false;
					// connect store to logout 
					const { default: store } = await import('../store');
					const  { dispatch } = store;
					dispatch(removeUser());
				
				}	
				return Promise.reject(_error);
			}
		 } 
	  }  

	  	return Promise.reject(err.response);
	}
 );
export default axiosClient;

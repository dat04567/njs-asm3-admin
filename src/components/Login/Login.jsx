import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { login } from '../../slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import './Login.css';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [error, setError] = useState('');
   const { isLoggedIn  } = useSelector((state) => state.auth);
   
   const handleSubmit = async () => {
      const data = {
         email: email,
         password: password,
      };
      try {
      
         await dispatch(login(data)).unwrap();
         navigate('/');
      } catch (error) {
         setError(error);
      }
   };

   
   if (isLoggedIn) return <Navigate to="/" />;

   return (
      <div className="page-wrapper d-block">
         <div className="page-breadcrumb">
            <div className="row">
               <div className="login">
                  <div className="heading">
                     <h2>Sign in</h2>
                     <form action="">
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="input-group input-group-lg">
                           <span className="input-group-addon">
                              <i className="fa fa-user"></i>
                           </span>
                           <input
                              type="text"
                              className="form-control"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                           />
                        </div>

                        <div className="input-group input-group-lg">
                           <span className="input-group-addon">
                              <i className="fa fa-lock"></i>
                           </span>
                           <input
                              type="password"
                              className="form-control"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                           />
                        </div>

                        <button type="button" className="float" onClick={handleSubmit}>
                           Login
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Login;

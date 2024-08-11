import React, { useReducer, useState } from 'react';
import { ProductAPI } from '../../API';
import { useLoaderData, useNavigate , redirect } from 'react-router-dom';
import AuthService from '../../service/auth.service';

const initialState = {
   nameProduct: '',
   category: '',
   shortDescription: '',
   longDescription: '',
   price: 1,
   productId: '',
};

function formReducer(state, action) {
   switch (action.type) {
      case 'SET_FIELD':
         return {
            ...state,
            [action.field]: action.value,
         };
      case 'SET_IMAGES':
         return {
            ...state,
            images: action.files,
         };
      case 'RESET_FORM':
         return initialState;
      default:
         return state;
   }
}

const EditProduct = () => {
   const products = useLoaderData();
   const [state, dispatch] = useReducer(formReducer, products || initialState);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const handleChange = (e) => {
      dispatch({
         type: 'SET_FIELD',
         field: e.target.name,
         value: e.target.value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         setLoading(true);

         const data = {
            ...state,
         };
         delete data.productId;
         await ProductAPI.updateProduct(data, state.productId);

         navigate('/products');
         setLoading(false);
      } catch (error) {
         setLoading(false);
         if (error.data && error.data.message) {
            setError(error.data.message);
         }
         console.log(error);
      }
   };

   return (
      <div className="page-wrapper d-block">
         <div className="page-breadcrumb">
            <div className="row">
               <form style={{ width: '50%', marginLeft: '40px' }} onSubmit={handleSubmit}>
                  <div className="form-group">
                     <label>Product Name</label>
                     <input
                        type="text"
                        name="nameProduct"
                        className="form-control"
                        placeholder="Enter Product Name"
                        value={state.nameProduct}
                        onChange={handleChange}
                     />
                     {error && error.name && <div className="alert alert-danger">{error.name}</div>}
                  </div>
                  <div className="form-group">
                     <label>Category</label>
                     <input
                        type="text"
                        className="form-control"
                        name="category"
                        placeholder="Enter Category"
                        value={state.category}
                        onChange={handleChange}
                     />
                  </div>
                  {error && error.category && (
                     <div className="alert alert-danger">{error.category}</div>
                  )}
                  <div className="form-group">
                     <label>Short Description</label>
                     <textarea
                        className="form-control"
                        rows="3"
                        name="shortDescription"
                        placeholder="Enter Short Description"
                        value={state.shortDescription}
                        onChange={handleChange}></textarea>
                  </div>
                  {error && error.shortDescription && (
                     <div className="alert alert-danger">{error.shortDescription}</div>
                  )}
                  <div className="form-group">
                     <label>Long Description</label>
                     <textarea
                        className="form-control"
                        rows="6"
                        name="longDescription"
                        placeholder="Enter Long Description"
                        value={state.longDescription}
                        onChange={handleChange}></textarea>
                  </div>
                  {error && error.longDescription && (
                     <div className="alert alert-danger">{error.longDescription}</div>
                  )}
                  <div className="form-group">
                     <label>Price product </label>
                     <input
                        type="number"
                        min="1"
                        name="price"
                        className="form-control"
                        placeholder="Enter Price"
                        value={state.price}
                        onChange={handleChange}
                     />
                  </div>
                  {error && error.price && <div className="alert alert-danger">{error.price}</div>}

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                     {loading ? 'Loading...' : 'Submit'}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
};

export default EditProduct;

export async function loader({ params, query }) {
   const user = AuthService.getUser();
   if (!user) {
      return redirect('/login');
   }
   if (user && user.role === 'staff') {
      return redirect('/chat');
   }
   const productId = params.productId;
   try {
      const res = await ProductAPI.getDetail(productId);
      return {
         nameProduct: res.data.name,
         category: res.data.category,
         shortDescription: res.data.short_desc,
         longDescription: res.data.long_desc,
         price: res.data.price,
         productId: res.data._id,
      };
   } catch (error) {
      console.log(error);
      return initialState;
   }
}

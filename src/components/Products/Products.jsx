import React, { useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';
import { ProductAPI } from '../../API';
import Pagination from './Component/Pagination';
import { Link } from 'react-router-dom';


const URL = process.env.REACT_APP_API_SERVER;   
function Products(props) {
   const [products, setProducts] = useState([]);

   const [pagination, setPagination] = useState({
      page: '1',
      count: '4',
      search: '',
      category: 'all',
   });

   const onChangeText = (e) => {
      const value = e.target.value;

      setPagination({
         page: pagination.page,
         count: pagination.count,
         search: value,
      });
   };

   //Tổng số trang
   const [totalPage, setTotalPage] = useState();

   //Hàm này dùng để thay đổi state pagination.page
   //Nó sẽ truyền xuống Component con và nhận dữ liệu từ Component con truyền lên
   const handlerChangePage = useCallback(
      async (value) => {
         console.log('Value: ', value);

         // //Sau đó set lại cái pagination để gọi chạy làm useEffect gọi lại API pagination
         setPagination({
            page: value,
            count: pagination.count,
            search: pagination.search,
            category: pagination.category,
         });
      },
      [pagination]
   );



   const handleDelete = useCallback(
      async (id) => {
         try {
            const isDelete = window.confirm('Do you want to delete this product?');

            if (!isDelete) return;
            const response = await ProductAPI.deleteProduct(id, pagination.page);

            setProducts(response.data.products);
            setTotalPage(response.data.totalPage);

         } catch (error) {
            window.alert(error.data.message);
            console.log(error);
         }
      },
      [pagination.page]
   );

   // //Gọi hàm Pagination
   useEffect(() => {
      const fetchData = async () => {
         const params = {
            page: pagination.page,
         };

         const query = queryString.stringify(params);

         const newQuery = '?' + query;

         const response = await ProductAPI.getAPI(newQuery);

         setProducts(response.data.products);
         setTotalPage(response.data.totalPage);
      };

      fetchData();
   }, [pagination.page]);


   

   return (
      <div className="page-wrapper d-block">
         <div className="page-breadcrumb">
            <div className="row">
               <div className="col-7 align-self-center">
                  <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
                     Basic Initialisation
                  </h4>
                  <div className="d-flex align-items-center">
                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb m-0 p-0">
                           <li className="breadcrumb-item">
                              <a href="/" className="text-muted">
                                 Home
                              </a>
                           </li>
                           <li className="breadcrumb-item text-muted active" aria-current="page">
                              Table
                           </li>
                        </ol>
                     </nav>
                  </div>
               </div>
            </div>
         </div>
         <div className="container-fluid">
            <div className="row">
               <div className="col-12">
                  <div className="card">
                     <div className="card-body">
                        <h4 className="card-title">Products</h4>
                        <input
                           className="form-control w-25"
                           onChange={onChangeText}
                           type="text"
                           placeholder="Enter Search!"
                        />
                        <br />
                        <div className="table-responsive">
                           <table className="table table-striped table-bordered no-wrap">
                              <thead>
                                 <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Image</th>
                                    <th>Category</th>
                                    <th>Edit</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {products &&
                                    products.map((value) => {
                                       const addHttpsIfNeeded = (url) => {
                                          if (!url.startsWith('https://')) {
                                             console.log('URL: ', url);
                                             return `${URL}/${url}`;
                                          }
                                          return url;
                                       };
                                       const imageUrl = addHttpsIfNeeded(
                                          value.img1 ||
                                             value.img2 ||
                                             value.img3 ||
                                             value.img4 ||
                                             value.img5
                                       );
                                       return (
                                          <tr key={value._id}>
                                             <td>{value._id}</td>
                                             <td>{value.name}</td>
                                             <td>{value.price}</td>
                                             <td>
                                                <img
                                                   src={imageUrl}
                                                   style={{
                                                      height: '60px',
                                                      width: '60px',
                                                   }}
                                                   alt=""
                                                />
                                             </td>
                                             <td>{value.category}</td>
                                             <td>
                                                <Link
                                                   to={`/products/${value._id}`}
                                                   style={{
                                                      cursor: 'pointer',
                                                      color: 'white',
                                                   }}
                                                   className="btn btn-success">
                                                   Update
                                                </Link>
                                                &nbsp;
                                                <button
                                                   style={{
                                                      cursor: 'pointer',
                                                      color: 'white',
                                                   }}
                                                   onClick={handleDelete.bind(this, value._id)}
                                                   className="btn btn-danger">
                                                   Delete
                                                </button>
                                             </td>
                                          </tr>
                                       );
                                    })}
                              </tbody>
                           </table>
                           <Pagination
                              page={pagination.page}
                              handlerChangePage={handlerChangePage}
                              totalPage={totalPage}
                              perPage={+pagination.count}
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <footer className="footer text-center text-muted"></footer>
      </div>
   );
}

export default Products;

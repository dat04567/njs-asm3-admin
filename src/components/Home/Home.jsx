import React, { Suspense } from 'react';
import { Await, defer, Link, useLoaderData, redirect } from 'react-router-dom';
import { OrderAPI } from '../../API';
import AuthService from '../../service/auth.service';

function Home(props) {
   const { orders } = useLoaderData();

   return (
      <div className="page-wrapper d-block">
         <div className="page-breadcrumb">
            <div className="row">
               <div className="col-7 align-self-center">
                  <div className="d-flex align-items-center">
                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb m-0 p-0">
                           <li className="breadcrumb-item">
                              <Link to="/">Dashboard</Link>
                           </li>
                        </ol>
                     </nav>
                  </div>
               </div>
            </div>
         </div>
         <div className="container-fluid">
            <div className="card-group">
               <div className="card border-right">
                  <div className="card-body">
                     <div className="d-flex d-lg-flex d-md-block align-items-center">
                        <div>
                           <div className="d-inline-flex align-items-center">
                              <h2 className="text-dark mb-1 font-weight-medium">2</h2>
                           </div>
                           <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate">
                              Clients
                           </h6>
                        </div>
                        <div className="ml-auto mt-md-3 mt-lg-0">
                           <span className="opacity-7 text-muted">
                              <i data-feather="user-plus"></i>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="card border-right">
                  <div className="card-body">
                     <div className="d-flex d-lg-flex d-md-block align-items-center">
                        <div>
                           <h2 className="text-dark mb-1 w-100 text-truncate font-weight-medium">
                              <sup className="set-doller">$</sup>44779000
                           </h2>
                           <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate">
                              Earnings of Month
                           </h6>
                        </div>
                        <div className="ml-auto mt-md-3 mt-lg-0">
                           <span className="opacity-7 text-muted">
                              <i data-feather="dollar-sign"></i>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="card border-right">
                  <div className="card-body">
                     <div className="d-flex d-lg-flex d-md-block align-items-center">
                        <div>
                           <div className="d-inline-flex align-items-center">
                              <h2 className="text-dark mb-1 font-weight-medium">2</h2>
                           </div>
                           <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate">
                              New Order
                           </h6>
                        </div>
                        <div className="ml-auto mt-md-3 mt-lg-0">
                           <span className="opacity-7 text-muted">
                              <i data-feather="file-plus"></i>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="card">
                  <div className="card-body">
                     <div className="d-flex d-lg-flex d-md-block align-items-center">
                        <div>
                           <h2 className="text-dark mb-1 font-weight-medium">10</h2>
                           <h6 className="text-muted font-weight-normal mb-0 w-100 text-truncate">
                              Projects
                           </h6>
                        </div>
                        <div className="ml-auto mt-md-3 mt-lg-0">
                           <span className="opacity-7 text-muted">
                              <i data-feather="globe"></i>
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="row">
               <div className="col-12">
                  <div className="card">
                     <div className="card-body">
                        <h4 className="card-title">History</h4>
                        <br />
                        <div className="table-responsive">
                           <table className="table table-striped table-bordered no-wrap">
                              <thead>
                                 <tr>
                                    <th>ID User</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Total</th>
                                    <th>Delivery</th>
                                    <th>Status</th>
                                    <th>Detail</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <Suspense fallback={<div>Loading...</div>}>
                                    <Await resolve={orders}>
                                       {(orders) =>
                                          orders.map((value) => (
                                             <tr key={value._id}>
                                                <td>{value.user}</td>
                                                <td>{value.customerInfo.name}</td>
                                                <td>{value.customerInfo.phone}</td>
                                                <td>{value.customerInfo.address}</td>
                                                <td>{value.totalAmount}</td>
                                                <td>
                                                   {value.delivery !== 'Waiting for processing'
                                                      ? 'Đã Vận Chuyển'
                                                      : 'Chưa Vận Chuyển'}
                                                </td>
                                                <td>
                                                   {value.status !== 'Waiting for pay'
                                                      ? 'Đã Thanh Toán'
                                                      : 'Chưa Thanh Toán'}
                                                </td>
                                                <td>
                                                   <a
                                                      href="/#"
                                                      style={{
                                                         cursor: 'pointer',
                                                         color: 'white',
                                                      }}
                                                      className="btn btn-success">
                                                      View
                                                   </a>
                                                </td>
                                             </tr>
                                          ))
                                       }
                                    </Await>
                                 </Suspense>
                              </tbody>
                           </table>
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

export default Home;

async function loadOrders() {
   try {
      const response = await OrderAPI.getOrders();
      return response.data;
   } catch (error) {
      console.log(error);
   }
}

export function loader() {
   const user = AuthService.getUser();
   if (!user) {
      return redirect('/login');
   }
   if (user && user.role === 'staff') {
      return redirect('/chat');
   }
   return defer({
      orders: loadOrders(),
   });
}

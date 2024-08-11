import {
   createBrowserRouter,
   createRoutesFromElements,
   Route,
   RouterProvider,
} from 'react-router-dom';
import {
   Home,
   Login,
   Root,
   Products,
   NewProduct,
   Users,
   Chat,
   Messages,
   History,
   loaderOrder,
   loaderMessages,
   EditProduct,
   loaderProduct
} from './components';
import AuthService from './service/auth.service';


const RoutesJSX = (
   <Route path="/" element={<Root />}>
      <Route index path="/" element={<Home />} loader={loaderOrder} />
      <Route path="/chat" element={<Chat />} >
         <Route index  path=':roomId' element={<Messages />} loader={loaderMessages} />
      </Route>
      <Route path="/history" element={<History />} />
      <Route path="/users" element={<Users />} />
      
      <Route path="/products" element={<Products />} loader={AuthService.checkAuth} />
      <Route path="/products/:productId" element={<EditProduct />} loader={loaderProduct} />

      <Route path="/login" element={<Login />} />
      <Route path="/new" element={<NewProduct />}   loader={AuthService.checkAuth}  />

   </Route>
);

const routes = createRoutesFromElements(RoutesJSX);

const router = createBrowserRouter(routes);

function App() {
   return <RouterProvider router={router} />;
}

export default App;

import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Resetpassword from './pages/Resetpassword';
import Forgotpassword from './pages/Forgotpassword';
import MainLayout from './components/MainLayout';
import Customers from './pages/Customers';
import Addproducts from './pages/Addproducts';
import Productlist from './pages/Productlist';
import Brand from './pages/Brand'
import Categories from './pages/Categories';
import Listcategory from './pages/Listcategory';
import Orders from './pages/Orders';
import Setlocation from './pages/Setlocation';
import Listlocation from './pages/Listlocation';
import Listbookinglocation from './pages/Listbookinglocation';
import Enquiries from './pages/Enquiries';
import Sport from './pages/Sport';
import Discount from './pages/Discount';
import Listdiscount from './pages/Listdiscount';
import EditCategory from './pages/EditCategory';
import EditProduct from './pages/EditProduct';
import EditLocation from './pages/EditLocation';
function App() {
  return (
   <Router>
    <Routes>
    <Route path='/' element={<Login />}/>
    <Route path='/reset-password/:token' element={<Resetpassword/>}/>
    <Route path='/forgot-password' element={<Forgotpassword/>}/>
    <Route path='/admin/' element={<MainLayout/>}>
    <Route index element={<Dashboard/>}/>
    <Route path='customers' element={<Customers/>}/>
    <Route path='add-products' element={<Addproducts/>}/>
    <Route path='product-list' element={<Productlist/>}/>
    <Route path='product-list/:productId' element={<EditProduct/>}/>
    <Route path='sport' element={<Sport/>}/>
    <Route path='brand' element={<Brand/>}/>
    <Route path='categories' element={<Categories/>}/>
    <Route path='category-list' element={<Listcategory/>}/>
    <Route path='category-list/:idCategory' element={<EditCategory/>}/>
    <Route path='orders' element={<Orders/>}/>
    <Route path='set-location' element={<Setlocation/>}/>
    <Route path='location-list/:locationId' element={<EditLocation/>}/>
    <Route path='location-list' element={<Listlocation/>}/>
    <Route path='booking-location-list' element={<Listbookinglocation/>}/>
    <Route path='enquiries' element={<Enquiries/>}/>
    <Route path='discount' element={<Discount />}/>
    <Route path='discount-list' element={<Listdiscount/>}/>
    </Route>
    </Routes>
   </Router>
  );
}

export default App;

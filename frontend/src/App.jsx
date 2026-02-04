import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Footer from "./layout/Footer.jsx";
import Navbar from "./layout/Navbar";
import Login from "./components/Users/Login";
import Register from "./components/Users/Register";
import Home from "./pages/Home";
import AdminPage from "./components/Admin/AdminPage";
import About from "./pages/About";
import Product from "./pages/Products";
import Contact from "./pages/Contact";
// import Dashboard from "./components/Admin/Dashboard";

import AuthGuard from "./services/AuthGuard.jsx";
import DashboardLayout from "./layout/Dashboardlayout";
import ProductDetails from "./components/Products/ProductDetails";
import Wishlist from "./pages/Wishlist/Wishlist";
import Cart from "./pages/Cart/Cart.jsx"
import Checkout from "./pages/Checkout/checkout.jsx";
import Payment from "./pages/Checkout/Payment.jsx";
import OrderSuccess from "./pages/Checkout/OrderSuccess.jsx";
import Profile from "./pages/Profile.jsx";
import Addresses from "./components/Users/Addresses.jsx";
import MyOrders from "./components/Users/MyOrders.jsx";
import ChangePassword from "./components/Users/ChangePassword.jsx";
import MyReturns from "./components/Users/MyReturns.jsx";
import OrderDetails from "./components/Users/OrderDetails.jsx";
import AccountInfo from "./components/Users/AccountInfo.jsx";

import DeliveryPersons from "./pages/admin/Delivery Persons/DeliveryPersons.jsx";
import NotActivatedDeliveryUsers from "./pages/admin/Delivery Persons/NotActivatedDeliveryUsers.jsx";


import Dashboard from "./pages/admin/Dashboard";
import AProducts from "./pages/admin/Products/AProducts";
import AStock from "./pages/admin/AStock";
import VendorsPage from "./pages/admin/Vendors/VendorsPage.jsx";
import AOrderstatus from "./pages/admin/AOrderstatus";
import ADeliveryAssign from "./pages/admin/ADeliveryAssign";
import AReturn from "./pages/admin/AReturn";
import ACancellations from "./pages/admin/ACancellations";
import APayments from "./pages/admin/APayments";
import AReport from "./pages/admin/AReport";
import AFeedback from "./pages/admin/AFeedback";
import ANotifications from "./pages/admin/ANotifications";
import AInquiries from "./pages/admin/AInquiries";
import ACompanydetail from "./pages/admin/ACompanydetail";
import { BadgeTurkishLiraIcon } from "lucide-react";
import AdminGuard from "./pages/admin/AdminGuard.jsx";



//ROUTES FROM ADMIN PAGES
import UsersList from "./pages/admin/users/UserList.jsx"
import CreateUser from "./pages/admin/users/CreateUser.jsx"
import EditUser from "./pages/admin/users/EditUser.jsx"
import ViewUser from "./pages/admin/users/ViewUser.jsx";


import ProductsDetails from "./pages/admin/Products/ProductsView.jsx";
import EditProduct from "./pages/admin/Products/EditProduct.jsx";
import AddProduct from "./pages/admin/Products/CreateProduct.jsx";


import ACategories from "./pages/admin/Categories/ACategories.jsx";
import SubCategoriesPage from "./pages/admin/Sub Categories/SubCategoriesPage.jsx";
import AdminUOM from "./pages/admin/AdminUOM.jsx";


import RawMaterialsPage from "./pages/admin/Raw Materials/RawMaterialsPage.jsx";
import ProductionList from "./pages/admin/Productions/ProductionList.jsx";
import CreateProduction from "./pages/admin/Productions/CreateProduction.jsx";
import ViewProduction from "./pages/admin/Productions/ViewProduction.jsx";
import EditProduction from "./pages/admin/Productions/EditProduction.jsx";



//purchase
import PurchaseList from "./pages/admin/Purchase/PurchaseList.jsx";
import CreatePurchase from "./pages/admin/Purchase/CreatePurchase.jsx";
import ViewPurchase from "./pages/admin/Purchase/ViewPurchase.jsx";
import EditPurchase from "./pages/admin/Purchase/EditPurchase.jsx";
import PurchaseReturnList from "./pages/admin/Purchase Returns/PurchaseReturnList.jsx";
import EditPurchaseReturn from "./pages/admin/Purchase Returns/EditPurchaseReturn.jsx";
import ViewPurchaseReturn from "./pages/admin/Purchase Returns/ViewPurchaseReturn.jsx";
import CreatePurchaseReturn from "./pages/admin/Purchase Returns/CreatePurchaseReturn.jsx";


//orders

import OrdersPage from "./pages/admin/Orders/OrdersPage.jsx";
import OrderDetailsPage from "./pages/admin/Orders/OrderDetailsPage.jsx";
import ReturnsPage from "./pages/admin/Order Returns/ReturnsPage.jsx";
import ReturnDetailsPage from "./pages/admin/Order Returns/ReturnsDetailsPage.jsx";


import OffersList from "./pages/admin/Offers/OffersList";
import CreateOffer from "./pages/admin/Offers/CreateOffer";
import EditOffer from "./pages/admin/Offers/EditOffer";
import OfferDetails from "./pages/admin/Offers/OfferDetails";



import QuotationDetails from "./pages/Wholesale Customer/QuotationDetails.jsx";
import QuotationsList from "./pages/Wholesale Customer/QuotationsList.jsx";
import QuotationCreate from "./pages/Wholesale Customer/QuotationCreate.jsx";
import UpdateQuotation from "./pages/Wholesale Customer/UpdateQuotation.jsx";
import WholesaleCheckout from "./pages/Wholesale Customer/WholesaleCheckout.jsx";

import AdminWholesaleQuotations from "./pages/admin/Wholesale/AdminWholesaleQuotations.jsx";
import AdminQuotationDetails from "./pages/admin/Wholesale/AdminQuotationDetails.jsx";

// Sidebar pages
const Projects = () => <h1>Projects Page</h1>;
const Messages = () => <h1>Messages Page</h1>;
const Analytics = () => <h1>Analytics Page</h1>;
const Tasks = () => <h1>Tasks Page</h1>;
const Help = () => <h1>Help Page</h1>;
const Settings = () => <h1>Settings Page</h1>;

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Home /> </>} />
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/products" element={<><Navbar /><Product /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /></>} />
        <Route path="/adminpage" element={<><Navbar /><AdminPage /><Footer /></>} />
        <Route path="/products/:id" element={<><Navbar /><ProductDetails /><Footer /></>} />
        <Route path="/wishlist" element={<><Navbar /><Wishlist /><Footer /></>} />
        <Route path="/cart" element={<><Navbar /><Cart /></>} />


        {/* Protected Routes */}

        <Route element={<AuthGuard />}>
          <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
          <Route path="/wholesale/checkout/:quotationID" element={<><Navbar /><WholesaleCheckout /><Footer /></>} />
          <Route path="/payment" element={<><Navbar /><Payment /><Footer /></>} />
          <Route path="/order-success" element={<><Navbar /><OrderSuccess /><Footer /></>} />
          <Route path="/profile" element={<><Navbar /><Profile /><Footer /></>}>
            <Route index element={<AccountInfo />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="myorders" element={<MyOrders />} />
            <Route path="myorders/:orderId" element={<OrderDetails />} />
            <Route path="returns" element={<MyReturns />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="quotations" element={<QuotationsList />} />
            <Route path="quotations/:quotationID" element={<QuotationDetails />} />
            <Route path="quotations/:quotationID/edit" element={<UpdateQuotation />} />

          </Route>
           <Route path="/quotations/create" element={<QuotationCreate />}/>


          {/* <Route path="/payment/:orderId" element={<Payment />} /> */}
        </Route>

        {/* Admin Routes (NO NAVBAR) */}
        <Route element={<AdminGuard />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Dashboard at /dashboard */}
            <Route index element={<Dashboard />} />
            {/* Product Management */}

            {/* PRODUCTS CRUD */}
            <Route path="products" element={<AProducts />} />
            <Route path="products/:productId" element={<ProductsDetails />} />
            <Route path="products/:productId/edit" element={<EditProduct />} />
            <Route path="products/create" element={<AddProduct />} />


            <Route path="categories" element={<ACategories />} />
            <Route path="subcategories" element={<SubCategoriesPage />} />


            <Route path="offers" element={<OffersList />} />
            <Route path="offers/create" element={<CreateOffer />} />
            <Route path="offers/:offerId" element={<OfferDetails />} />
            <Route path="offers/:offerId/edit" element={<EditOffer />} />

            {/* Add other routes as needed */}
            {/* Inventory & Production Routes */}
            <Route path="astock" element={<AStock />} />
            <Route path="unit-of-measurements" element={<AdminUOM />} />
            <Route path="raw-materials" element={<RawMaterialsPage />} />


            <Route path="productions/" element={<ProductionList />}/>
            <Route path="productions/create"element={<CreateProduction />}/>
            <Route path="productions/:id"element={<ViewProduction />}/>
            <Route path="productions/:id/edit"element={<EditProduction />}/>

            <Route path="purchases" element={<PurchaseList />} />
            <Route path="purchases/create" element={<CreatePurchase />} />
            <Route path="purchases/:id/edit" element={<EditPurchase />} />
            <Route path="purchases/:id" element={<ViewPurchase />} />

            <Route path="purchase-returns" element={<PurchaseReturnList />}/>
            <Route path="purchase-returns/create" element={<CreatePurchaseReturn />}/>
            <Route path="purchase-returns/:returnID" element={<ViewPurchaseReturn />}/>
            <Route path="purchase-returns/:returnID/edit" element={<EditPurchaseReturn />}/>




            {/* <Route path="acustomers" element={<ACustomers />} />
            <Route path="avendors" element={<AVendors />} />
            <Route path="adelivery-persons" element={<ADeliveryperson />} /> */}

            {/* ================= USERS CRUD ================= */}
            <Route path="users" element={<UsersList />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/:id" element={<ViewUser />} />
            <Route path="users/:id/edit" element={<EditUser />} />

            <Route path="delivery-persons"element={<DeliveryPersons />}/>
            <Route path="delivery-persons/not-activated"element={<NotActivatedDeliveryUsers />}/>

            {/* ================= VENDORS CRUD ================= */}
            <Route path="vendors" element={<VendorsPage />} />

            {/* ================= UOM CRUD ================= */}



            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetailsPage />} />

            <Route path="returns" element={<ReturnsPage />} />
            <Route path="returns/:returnId" element={<ReturnDetailsPage />} /> 



            <Route path="areturn" element={<AReturn />} />
            <Route path="acancellations" element={<ACancellations />} />


            <Route path="quotations" element={<AdminWholesaleQuotations />} />
            <Route path="quotations/:quotationID" element={<AdminQuotationDetails />}/>
          




            <Route path="apayments" element={<APayments />} />
            <Route path="areport" element={<AReport />} />


            <Route path="afeedback" element={<AFeedback />} />
            <Route path="anotifications" element={<ANotifications />} />
            <Route path="ainquiries" element={<AInquiries />} />


            <Route path="acompany-details" element={<ACompanydetail />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

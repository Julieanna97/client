import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import AdminGate from "../components/AdminGate";

// Shop Pages
import Home from "../pages/Home";
import Products from "../pages/Products";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation";
import SearchResults from "../pages/SearchResults";
import NotFound from "../pages/NotFound";

// Admin Pages
import AdminHome from "../pages/admin/AdminHome";
import ManageCustomers from "../pages/admin/ManageCustomers";
import CreateCustomer from "../pages/admin/CreateCustomer";
import UpdateCustomer from "../pages/admin/UpdateCustomer";
import ManageProducts from "../pages/admin/ManageProducts";
import CreateProduct from "../pages/admin/CreateProduct";
import UpdateProduct from "../pages/admin/UpdateProduct";
import ManageOrders from "../pages/admin/ManageOrders";
import OrderDetails from "../pages/admin/OrderDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "product/:id", element: <Product /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "order-confirmation", element: <OrderConfirmation /> },
      { path: "search", element: <SearchResults /> },

      {
        path: "admin",
        element: <AdminGate />,
        children: [
          { index: true, element: <AdminHome /> },

          { path: "customers", element: <ManageCustomers /> },
          { path: "customers/create", element: <CreateCustomer /> },
          { path: "customers/update/:id", element: <UpdateCustomer /> },

          { path: "products", element: <ManageProducts /> },
          { path: "products/create", element: <CreateProduct /> },
          { path: "products/update/:id", element: <UpdateProduct /> },

          { path: "orders", element: <ManageOrders /> },
          { path: "orders/:id", element: <OrderDetails /> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;

import { Home, ProductDetail } from "@pages/users";
import { UsersLayout, AdminLayout } from "@layouts";
import { Dashboard, AddProduct } from "@pages/admin";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <UsersLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/product/add", element: <AddProduct /> },
    ],
  },
]);

export default router;

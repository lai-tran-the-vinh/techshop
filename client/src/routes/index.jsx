import { Home } from "@pages/users";
import { UsersLayout } from "@layouts";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <UsersLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export default router;

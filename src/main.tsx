import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./index.scss";
import { Home } from "./pages/Home.tsx";
import { Trainer } from "./pages/Trainer.tsx";
import { Arena } from "./pages/Arena.tsx";
import { Nav } from "./components/generic/Nav.tsx";

const Layout = () => (
  <>
    <Nav />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/trainer",
        element: <Trainer />,
      },
      {
        path: "/arena",
        element: <Arena />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
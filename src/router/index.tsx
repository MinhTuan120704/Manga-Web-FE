import { createBrowserRouter } from "react-router-dom";
import { Homepage } from "@/pages/Homepage";
import { MangaDetail } from "@/pages/MangaDetail/MangaDetail";
import { NotFound } from "@/pages/NotFound/NotFound";
import AdminPage from "@/pages/Admin/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/manga/:id",
    element: <MangaDetail />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  // TODO: Add other routes here
  // Example:
  // {
  //   path: '/manga/:id',
  //   element: <MangaDetail />,
  // },
  // {
  //   path: '/search',
  //   element: <SearchPage />,
  // },
  // {
  //   path: '/profile',
  //   element: <ProfilePage />,
  // },
]);

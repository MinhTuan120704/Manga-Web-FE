import { createBrowserRouter } from "react-router-dom";
import { Homepage } from "@/pages/Homepage";
import { NotFound } from "@/pages/NotFound/NotFound";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "*",
    element: <NotFound />,
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

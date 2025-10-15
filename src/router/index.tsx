import { createBrowserRouter } from "react-router-dom";
import { Homepage } from "@/pages/Homepage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
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

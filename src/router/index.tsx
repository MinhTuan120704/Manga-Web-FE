import { createBrowserRouter } from "react-router-dom";
import { Homepage } from "@/pages/Homepage";
import { MangaDetail } from "@/pages/MangaDetail/MangaDetail";
import { NotFound } from "@/pages/NotFound/NotFound";

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
]);

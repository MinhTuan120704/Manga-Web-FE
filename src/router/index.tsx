import { createBrowserRouter } from "react-router-dom";
import { Homepage } from "@/pages/Home/Homepage";
import { MangaDetail } from "@/pages/MangaDetail/MangaDetail";
import { MangaReader } from "@/pages/MangaReader/MangaReader";
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
    path: "/reader/:chapterId",
    element: <MangaReader />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

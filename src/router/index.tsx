import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

const Homepage = lazy(() => import("@/pages/Homepage"));
const MangaDetail = lazy(() => import("@/pages/MangaDetail/MangaDetail"));
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));
const AdminPage = lazy(() => import("@/pages/Admin/Admin"));
const LoadingSpinner = lazy(() => import("@/components/common/LoadingSpinner"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Homepage />
      </Suspense>
    ),
  },
  {
    path: "/manga/:id",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <MangaDetail />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminPage />
      </Suspense>
    ),
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

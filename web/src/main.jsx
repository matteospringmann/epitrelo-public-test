// web/src/main.jsx (Version Corrigée)

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Protected from "./components/Protected.jsx";
import BoardsList from "./pages/BoardsList.jsx";
import SingleBoardPage from "./pages/SingleBoardPage.jsx";
import AcceptInvitePage from "./pages/AcceptInvitePage.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/profile",
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
      },
      {
        path: "/boards",
        element: (
          <Protected>
            <BoardsList />
          </Protected>
        ),
      },
      {
        path: "/board/:boardId",
        element: (
          <Protected>
            <SingleBoardPage />
          </Protected>
        ),
      },
      { path: "/invite/:token", element: <AcceptInvitePage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);

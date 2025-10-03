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

// --- CORRECTION : AJOUTEZ CES DEUX LIGNES ---
import BoardsList from "./pages/BoardsList.jsx";
import SingleBoardPage from "./pages/SingleBoardPage.jsx";
// ------------------------------------------

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

            // Ces routes utilisent maintenant les composants qui viennent d'être importés
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
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);

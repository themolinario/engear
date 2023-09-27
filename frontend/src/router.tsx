import {createBrowserRouter, Navigate} from "react-router-dom";
import AppLayout from "./layout/AppLayout.tsx";
import VideoDetail from "./pages/VideoDetail";
import {AddVideoPage} from "./pages/AddVideoPage";
import {LoginPage} from "./pages/LoginPage";
import Home from "./pages/HomePage";
import {SignUpPage} from "./pages/SignUpPage";

export const router = createBrowserRouter([
    {
        path: "/login",
        element:  <LoginPage />,
    },
    {
        path: "signup",
        element: <SignUpPage />
    },
    {
        element: <AppLayout/>,
        children: [
            {
                path: "/",
                element: <Navigate to="/login" replace />,
            },
            {
                path: "/home",
                element: <Home />
            },
            {
                path: "/:videoId",
                element: <VideoDetail />
            },
            {
                path: "/add-video",
                element: <AddVideoPage />
            }


        ]
    }
])
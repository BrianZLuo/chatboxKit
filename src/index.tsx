import React from "react";
import ReactDOM from "react-dom/client";
//import { createHashRouter, RouterProvider } from "react-router-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";

import "./index.css";

import Layout from "./pages/layout/Layout";
import Chat from "./pages/chat/Chat";
//
import NoPage from "./pages/NoPage";
import OneShot from "./pages/oneshot/OneShot";
//


initializeIcons();

// const router = createHashRouter([
//     {
//         path: "/",
//         element: <Layout />,
//         children: [
//             {
//                 index: true,
//                 element: <Chat />
//             },
//             {
//                 path: "qa",
//                 lazy: () => import("./pages/oneshot/OneShot")
//             },
//             {
//                 path: "*",
//                 lazy: () => import("./pages/NoPage")
//             }
//         ]
//     }
// ]);

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Chat />} />
                    <Route path="qa" element={<OneShot />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        { /* <RouterProvider router={router} /> */}
        <App />
    </React.StrictMode>
);

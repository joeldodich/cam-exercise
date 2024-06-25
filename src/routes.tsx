import { Outlet } from "react-router-dom";
import { ViewerProvider } from "./context/ViewerProvider/viewer-provider";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Viewer } from "./pages/Viewer/Viewer";

export const routes = [
    {
        path: "/",
        element: <div>Workspace</div>,
    },
    {
        path: "cam-assist",
        element: <Outlet />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "partId",
                element: (
                    <ViewerProvider>
                        <Viewer />
                    </ViewerProvider>
                ),
            },
        ],
    },
    { path: "*", element: <div>404</div> },
];

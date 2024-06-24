import { Outlet } from "react-router-dom";
import { Viewer } from "./components/Viewer/Viewer";
import { ViewerProvider } from "./context/ViewerProvider/viewer-provider";

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
                element: <div>Part List</div>,
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
];

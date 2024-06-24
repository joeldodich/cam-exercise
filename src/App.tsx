import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

function App() {
    const router = useMemo(() => {
        return createBrowserRouter(routes);
    }, []);

    return <RouterProvider router={router} />;
}

export default App;

import { NavBreadcrumbs } from "./NavBreadcrumbs/NavBradcrumbs";

export const TopNav = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="w-full h-9 min-h-9 px-4 my-4 flex items-center align-middle justify-between relative">
            <NavBreadcrumbs />
            {children}
            <div></div>
        </div>
    );
};

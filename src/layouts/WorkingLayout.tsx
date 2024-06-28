import { TopNav } from "@/components/TopNav/TopNav";
import styled from "styled-components";

interface WorkingLayoutProps {
    children: React.ReactNode;
    headerSlot?: React.ReactNode;
    panelSlot?: React.ReactNode;
}

const RightPanel = styled.div`
    width: 20.25rem;
    min-width: 20.25rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
`;

export const WorkingLayout = ({
    children,
    headerSlot,
    panelSlot,
}: WorkingLayoutProps) => {
    return (
        <div className="h-full w-full min-w-full flex flex-row bg-slate-50 relative">
            <div className="h-full flex flex-col flex-auto relative">
                <TopNav />
                <div className="mx-3 mb-3 bg-white rounded-lg border-2 border-slate-300 flex-grow overflow-clip relative">
                    {children}
                </div>
            </div>
            <RightPanel className="pr-3 overflow-hidden">
                {panelSlot}
            </RightPanel>
        </div>
    );
};

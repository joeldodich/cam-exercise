import styled from "styled-components";

interface WorkingLayoutProps {
    children: React.ReactNode;
    headerSlot?: React.ReactNode;
    panelSlot?: React.ReactNode;
}

const RightPanel = styled.div`
    width: 300px;
    min-width: 300px;
    height: 100%;
    display: block;
`;

export const WorkingLayout = ({
    children,
    headerSlot,
    panelSlot,
}: WorkingLayoutProps) => {
    return (
        <div className="h-full w-full min-w-full flex flex-row bg-slate-50">
            <div className="h-full flex flex-col flex-auto">
                <div>{headerSlot}</div>
                <div className="ml-3 mb-3 bg-white rounded-lg border-2 border-slate-300 flex-grow">
                    {children}
                </div>
            </div>
            <RightPanel>{panelSlot}</RightPanel>
        </div>
    );
};

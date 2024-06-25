import { TitleCard } from "@/components/TitleCard/TitleCard";

export const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <div className="container"> 
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-3">
                    <TitleCard
                        title="Model Viewer"
                        imageUrl="https://via.placeholder.com/150"
                    />
                    <TitleCard
                        title="Model Viewer"
                        imageUrl="https://via.placeholder.com/150"
                    />
                    <TitleCard
                        title="Model Viewer"
                        imageUrl="https://via.placeholder.com/150"
                    />
                </div>
            </div>
        </div>
    );
};

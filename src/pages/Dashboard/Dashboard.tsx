import { PersonAvatar } from "@/components/common/PersonAvatar/PersonAvatar";
import { TitleCard } from "@/components/common/TitleCard/TitleCard";
import { TopNav } from "@/components/TopNav/TopNav";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const navigation = useNavigate();
    const descriptionSlotElement = (
        <span className="flex flex-row align-middle items-center gap-1 text-xs text-slate-500 truncate">
            <PersonAvatar className="h-4 w-4" /> Created 6/24/24 at 10:24AM
        </span>
    );
    return (
        <div className="h-full w-full overflow-y-auto flex flex-col">
            <TopNav />
            <h1>Dashboard</h1>
            <div>
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-3">
                    <TitleCard
                        title="Model Viewer"
                        imageUrl="https://via.placeholder.com/150"
                        descriptionSlot={descriptionSlotElement}
                        size="lg"
                        onClick={() => navigation("1")}
                    />
                    <TitleCard
                        title="Model Viewer"
                        imageUrl="https://via.placeholder.com/150"
                        descriptionSlot={descriptionSlotElement}
                        size="lg"
                        onClick={() => navigation("2")}
                    />
                    <TitleCard
                        title="Model Viewer"
                        imageUrl="https://via.placeholder.com/150"
                        descriptionSlot={descriptionSlotElement}
                        size="lg"
                        onClick={() => navigation("3")}
                    />
                </div>
            </div>
        </div>
    );
};

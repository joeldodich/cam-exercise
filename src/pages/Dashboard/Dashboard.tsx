import { PersonAvatar } from "@/components/common/PersonAvatar";
import { TitleCard } from "@/components/TitleCard/TitleCard";

export const Dashboard = () => {
    const descriptionSlotElement = (
        <span className="flex flex-row align-middle items-center gap-1 text-xs text-slate-500 truncate">
            <PersonAvatar className="h-4 w-4" /> Created 6/24/24 at 10:24AM
        </span>
    );
    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-3">
                    <TitleCard
                        title="Model Viewer"
                        imageUrl="https://via.placeholder.com/150"
                        descriptionSlot={descriptionSlotElement}
                        size="lg"
                    />
                    <TitleCard
                        title="Model Viewer"
                        imageUrl="https://via.placeholder.com/150"
                        descriptionSlot={descriptionSlotElement}
                        size="lg"
                    />
                    <TitleCard
                        title="Model Viewer"
                        imageUrl="https://via.placeholder.com/150"
                        descriptionSlot={descriptionSlotElement}
                        size="lg"
                    />
                </div>
            </div>
        </div>
    );
};

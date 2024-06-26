import { PersonAvatar } from "@/components/common/PersonAvatar/PersonAvatar";
import { ScrollFadeFooter } from "@/components/common/ScrollFadeFooter/ScrollFadeFooter";
import {
    TitleCard,
    TitleCardLoader,
} from "@/components/common/TitleCard/TitleCard";
import { TopNav } from "@/components/TopNav/TopNav";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const navigation = useNavigate();
    const descriptionSlotElement = (
        <span className="flex flex-row align-middle items-center gap-1 text-xs text-slate-500 truncate">
            <PersonAvatar className="h-4 w-4" /> Created 6/24/24 at 10:24AM
        </span>
    );

    const { isLoading, isFetching } = useQuery({
        queryKey: ["parts"],
        queryFn: async () =>
            await new Promise((resolve) => setTimeout(resolve, 1500)),
    });

    // Demo helpers
    const cardCount = 24;
    const range = Array.from(Array(cardCount).keys());

    return (
        <div className="h-full w-full overflow-y-auto flex flex-col">
            <TopNav />
            <div className="px-4 mb-5">
                <h1 className="text-3xl font-bold text-slate-700 mb-3">
                    Ready for Review
                </h1>
                {isLoading && isFetching && <DashboardLoader />}
                {!isLoading && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto gap-3 align-middle">
                        {range.map((index) => (
                            <TitleCard
                                title={`Part ${index + 1}`}
                                imageUrl="https://via.placeholder.com/150"
                                descriptionSlot={descriptionSlotElement}
                                size="lg"
                                onClick={() => navigation(`${index + 1}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ScrollFadeFooter />
        </div>
    );
};

const DashboardLoader = () => {
    const loaderCount = 24;
    const range = Array.from(Array(loaderCount).keys());
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto gap-3 align-middle">
            {range.map((index) => (
                <TitleCardLoader key={index} size="lg" />
            ))}
        </div>
    );
};

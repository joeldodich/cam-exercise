import { Skeleton } from "@/components/ui/skeleton";
import { styled } from "styled-components";
import { twMerge } from "tailwind-merge";
import { Card, CardContent } from "../../ui/card";

interface TitleCardProps {
    title: string;
    imageUrl: string;
    active?: boolean;
    onClick?: () => void;
    size?: "sm" | "lg";
    descriptionSlot?: React.ReactNode;
    actionSlot?: React.ReactNode;
}

const StyledCard = styled(Card)<{ active?: boolean }>`
    flex: 1;
    max-width: 24rem;
    min-width: 19rem;
    cursor: pointer;
    &:hover {
        background: ${(props) =>
            props.active
                ? "rgba(147, 197, 253, 0.50)"
                : "rgba(203, 213, 225, 0.5)"};
        box-shadow: 0px 4px 4px 0px rgba(174, 174, 174, 0.25);
    }
    background: ${(props) => (props.active ? "rgba(147, 197, 253, 0.50)" : "")};
    border: ${(props) =>
        props.active ? "1px solid var(--blue-500, #3B82F6)" : ""};
    transition: all 0.08s ease-in-out;
`;

const ImageContainer = styled.div<{ imageUrl: string; size: "sm" | "lg" }>`
    background-image: url(${(props) => props.imageUrl});
    background-size: cover;
    background-position: center;
    height: ${(props) => (props.size === "sm" ? "2.5rem" : "5rem")};
    min-width: ${(props) => (props.size === "sm" ? "2.5rem" : "5rem")};
    display: block;
    border-radius: 0.5rem;
`;

export const TitleCard = ({
    title,
    imageUrl,
    active = false,
    size = "sm",
    descriptionSlot,
    actionSlot,
    onClick,
}: TitleCardProps) => {
    const titleFont = size === "sm" ? "text-sm" : "text-xl";
    const titleClasses = twMerge(titleFont, "truncate", "text-left");

    return (
        <StyledCard onClick={onClick} active={active}>
            <CardContent className="flex flex-1 flex-row gap-2 h-full w-full items-center p-3">
                <ImageContainer
                    imageUrl={imageUrl}
                    size={size}
                    className="rounded-sm border-2"
                />
                <div className="flex flex-1 truncate flex-col">
                    <div className={titleClasses}>{title}</div>
                    {descriptionSlot}
                </div>
                {actionSlot}
            </CardContent>
        </StyledCard>
    );
};

export const TitleCardLoader = styled(Skeleton)<{ size: "sm" | "lg" }>`
    flex: 1;
    max-width: 24rem;
    min-width: 19rem;
    height: ${(props) => (props.size === "sm" ? "4rem" : "6.5rem")};
    border-radius: 0.5rem;
`;

import { styled } from "styled-components";
import { twMerge } from "tailwind-merge";
import { Card, CardContent } from "../ui/card";

interface TitleCardProps {
    title: string;
    imageUrl: string;
    size?: "sm" | "lg";
    descriptionSlot?: React.ReactNode;
    actionSlot?: React.ReactNode;
}

const StyledCard = styled(Card)`
    flex: 1;
    max-width: 24rem;
    min-width: 19rem;
    cursor: pointer;
    &:hover {
        box-shadow: 0px 0.25rem 0.25rem 0px rgba(174, 174, 174, 0.25);
        background: var(--blue-200, #bfdbfe);
        border: 1px solid var(--blue-700, #1d4ed8);
    }
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
    size = "sm",
    descriptionSlot,
    actionSlot,
}: TitleCardProps) => {
    const titleFont = size === "sm" ? "text-sm" : "text-xl";
    const titleClasses = twMerge(titleFont, "truncate", "text-left");

    return (
        <StyledCard>
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

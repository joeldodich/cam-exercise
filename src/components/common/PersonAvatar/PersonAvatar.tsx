import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const PersonAvatar = (props: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <Avatar {...props}>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    );
};

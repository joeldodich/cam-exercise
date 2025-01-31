import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Slash } from "lucide-react";
import { Link, useMatch, useParams } from "react-router-dom";

export const NavBreadcrumbs = () => {
    const params = useParams();
    const onSinglePartPage = useMatch("/:partId");
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    {onSinglePartPage && (
                        <BreadcrumbLink asChild>
                            <Link to={"/"} className="items-center gap-2 flex">
                                <Button variant={"outline"} size={"icon"}>
                                    <ArrowLeft size={16} />
                                </Button>
                                <span>Analysis Dashboard</span>
                            </Link>
                        </BreadcrumbLink>
                    )}
                    {!onSinglePartPage && (
                        <BreadcrumbPage>
                            <strong>Analysis Dashboard</strong>
                        </BreadcrumbPage>
                    )}
                </BreadcrumbItem>
                {onSinglePartPage && (
                    <>
                        <BreadcrumbSeparator>
                            <Slash />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                <strong>{`Part ${params.partId}`}</strong>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

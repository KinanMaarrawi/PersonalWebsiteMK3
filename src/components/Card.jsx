import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
    return (
        <div
            className={cn(
                "bg-gray-900 text-gray-200 flex flex-col rounded-xl border border-gray-800 shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out",
                className
            )}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }) {
    return (
        <div
            className={cn("px-4 py-3", className)}
            {...props}
        />
    );
}

function CardTitle({ className, ...props }) {
    return (
        <div className={cn("text-lg font-bold text-purple-400", className)} {...props} />
    );
}

function CardDescription({ className, ...props }) {
    return (
        <div className={cn("text-gray-300 text-sm mt-1", className)} {...props} />
    );
}

export { Card, CardHeader, CardTitle, CardDescription };

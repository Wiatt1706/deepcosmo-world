import { Skeleton } from "@nextui-org/react";
import React from "react";

interface SkeletonLoaderProps {
  count: number; // Number of skeleton items to display
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="d_c_c w-full">
          <div
            key={index}
            className="max-w-[300px] w-full flex items-center gap-3 mb-4"
          >
            <div>
              <Skeleton className="flex rounded-md w-12 h-12" />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-3 w-3/5 rounded-lg" />
              <Skeleton className="h-3 w-4/5 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

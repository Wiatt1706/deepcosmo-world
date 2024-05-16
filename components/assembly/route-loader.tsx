"use client";
import { Card, Progress, Skeleton, Spinner } from "@nextui-org/react";

export default function RouteLoader() {
  const generateCards = () => {
    const cards = [];
    for (let i = 0; i < 12; i++) {
      cards.push(
        <Card
          key={i}
          style={{
            zIndex: 0,
          }}
          className="space-y-5 p-4 border shadow-none w-full col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
        >
          <Skeleton className="rounded-lg">
            <div className="h-24 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
            </Skeleton>
          </div>
        </Card>
      );
    }
    return cards;
  };

  return (
    <>
      <div className="flex items-center justify-center fixed top-0 left-0 right-0 z-50 w-full">
        <Progress
          size="sm"
          isIndeterminate
          aria-label="Loading..."
          className="w-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-[1500px] p-8">
        <div className="w-full max-w-[1500px] gap-6 grid grid-cols-12">
          {generateCards()}
        </div>
      </div>
    </>
  );
}

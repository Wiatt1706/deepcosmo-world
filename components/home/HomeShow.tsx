import React from "react";
import Lands from "@/components/land/land-info";
import { Button } from "@nextui-org/button";
import { TbPlus, TbUpload } from "react-icons/tb";
import HomeLandSearch from "@/components/land/home-land-search";
import Footer from "@/components/layout/footer";

export default async function HomeShow({ lands }: { lands: any }) {
  return (
    <div className="w-full max-h-screen h-full overflow-y-auto inline-block text-center justify-center bg-[#f3f6f8]">
      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-start w-full max-w-[1500px] px-8 pt-8">
          <HomeLandSearch />
          <h1 className="text-2xl font-bold text-left pt-8 text-[#20272c]">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-[1500px] p-8 gap-2">
          <div className="w-full flex justify-between">
            <h3 className="text-lg text-[#20272c] font-bold">
              Recently modified
            </h3>
            <div className="flex gap-1 items-center">
              <Button size="sm" variant="bordered" startContent={<TbPlus />}>
                Creat Land
              </Button>
              <Button color="primary" size="sm" startContent={<TbUpload />}>
                Upload Land
              </Button>
            </div>
          </div>
          <Lands lands={lands} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

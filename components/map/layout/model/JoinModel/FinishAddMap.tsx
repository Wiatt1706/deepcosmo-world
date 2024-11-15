"use client";
import { useEffect } from "react";
import { Button } from "@nextui-org/button";
import { ModalBody, ModalFooter } from "@nextui-org/react";
import { launchConfetti } from "@/components/map/helpers/GeneralTools";
import { useRouter } from "next/navigation";
import { useReloadData } from "../../ShowMapIndex";
export default function FinishAddMap({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const reloadData = useReloadData();

  useEffect(() => {
    launchConfetti({
      count: 50,
    });
  }, []);

  const handleNext = () => {
    reloadData();
    onClose();
  };

  return (
    <>
      <ModalBody className="w-full">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/3 w-1/2 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-20 blur-2xl transform rotate-45"></div>
          <div className="absolute top-0 right-1/4 w-1/3 h-full bg-gradient-to-b from-transparent via-green-300 to-transparent opacity-20 blur-2xl transform -rotate-45"></div>
          <div className="animate-pulse bg-green-300 rounded-full h-24 w-24 opacity-10 blur-lg top-1/3 right-1/4 absolute"></div>
        </div>
        <div className="d_c_c my-12">
          <span className="text-3xl font-extrabold text-green-900 mb-3">
            恭喜新添一块土地
          </span>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex gap-2 px-2 w-full">
          <Button
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:shadow-lg transform  transition duration-300"
            variant="shadow"
            onPress={handleNext}
          >
            刷新地图
          </Button>
          <Button variant="shadow" onPress={() => router.push("/home")}>
            前往查看
          </Button>
        </div>
      </ModalFooter>
    </>
  );
}

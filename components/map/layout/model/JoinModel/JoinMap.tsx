import React, { useState } from "react";
import { TbMapPinFilled } from "react-icons/tb";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import AddMapIndex from "./AddMapIndex";
import { Session } from "@supabase/auth-helpers-nextjs";
import EditAddMap from "./EditAddMap";
import FinishAddMap from "./FinishAddMap";

export default function JoinMap({
  landInfo,
  session,
}: {
  landInfo: Land;
  session?: Session | null;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const nextStep = () => {
    setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
  };
  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <>
      <Button
        className={`border-2 border-white shadow bg-white`}
        startContent={<TbMapPinFilled size={16} />}
        color="primary"
        radius="full"
        variant="flat"
        size="sm"
        onPress={() => onOpen()}
      >
        <b>入驻</b>
      </Button>

      <Modal
        backdrop="blur"
        size={currentStep === 1 ? "3xl" : "md"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        className="overflow-hidden"
        classNames={{ wrapper: "overflow-hidden" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex items-center space-x-2 ${
                        step <= currentStep ? "text-blue-500" : "text-gray-300"
                      }`}
                    >
                      <div
                        className={`h-6 w-6 rounded-full border-2 flex justify-center items-center text-xs ${
                          step <= currentStep
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "bg-white border-gray-300 text-gray-500"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`flex-1 h-1 ${
                            step < currentStep ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        />
                      )}
                      {step === currentStep && (
                        <span className="ml-2 font-semibold text-[16px]">
                          {step === 1 && "Step 1: 选择地块"}
                          {step === 2 && "Step 2: 设置地块信息"}
                          {step === 3 && "Step 3: 完成"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </ModalHeader>
              {currentStep === 1 && (
                <AddMapIndex
                  session={session}
                  landInfo={landInfo}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <EditAddMap
                  session={session}
                  landInfo={landInfo}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 3 && <FinishAddMap onClose={onClose} />}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

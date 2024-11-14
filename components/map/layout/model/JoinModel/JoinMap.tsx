import React, { useEffect, useState } from "react";
import { TbMapPinFilled } from "react-icons/tb";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import AddMapIndex from "./AddMapIndex";
import { Session } from "@supabase/auth-helpers-nextjs";

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
        size="3xl"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody>
              <div className="flex flex-col relative py-4">
                {/* Step Indicator */}

                <div className="flex items-center space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`flex items-center space-x-2 ${
                        step <= currentStep ? "text-blue-500" : "text-gray-300"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full border-2 flex justify-center items-center ${
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
                        <span className="ml-2 font-semibold text-lg">
                          {step === 1 && "Step 1: 选择地块"}
                          {step === 2 && "Step 2: 设置地块信息"}
                          {step === 3 && "Step 3: 提交地块信息"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                <div className="mt-6">
                  {currentStep === 1 && (
                    <AddMapIndex session={session} landInfo={landInfo} onNext={nextStep} />
                  )}
                  {currentStep === 2 && (
                    <div className="flex flex-col relative">
                      <div className="d_c_b">
                        <Button color="primary" size="sm" onClick={prevStep}>
                          Previous
                        </Button>
                        <Button color="primary" size="sm" onClick={nextStep}>
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                  {currentStep === 3 && (
                    <div className="flex flex-col relative">
                      <div className="flex justify-start">
                        <Button color="primary" size="sm" onClick={prevStep}>
                          Previous
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

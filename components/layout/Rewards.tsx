"use client";
import { Button } from "@nextui-org/button";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";
import { LiLandsBoxSvg } from "@/components/utils/icons";
import { post as postApi } from "@/utils/api";

export function FirstLoginReward({
  session,
  onRewardClaimed,
}: {
  session?: Session | null;
  onRewardClaimed: () => void;
}) {
  const supabase = createClientComponentClient();
  const rewardCode = "FirstLoginReward";
  const prevRef = useRef<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true); // 跟踪加载状态

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleRewardData = useCallback(async () => {
    setIsLoading(true);
    if (!session) return;
    let { data: queryActivity } = await supabase
      .from("ActivitiesUser")
      .select("*")
      .eq("user_id", session?.user.id)
      .eq("system_code", rewardCode)
      .eq("is_completed", true);

    if (!queryActivity?.length) {
      onOpen();
    }
    setIsLoading(false);
  }, [supabase, session]);

  const handleClaimLand = async () => {
    onOpenChange();
    await postApi(`/reward/FirstLoginReward`, {
      activityId: null,
      systemCode: rewardCode,
    }).then((res) => {
      if (res.data) {
        onRewardClaimed();
      }
    });
  };

  useEffect(() => {
    if (session && session.user.id && prevRef.current !== session.user.id) {
      handleRewardData();
      prevRef.current = session.user.id; // 更新 ref，避免重复调用
    }
  }, [session, handleRewardData]);

  return (
    session && (
      <>
        <Modal
          backdrop="blur"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          className="bg-gradient-to-br from-green-100 to-blue-200 rounded-lg p-6 shadow-2xl relative"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody>
                  <div className="d_c_c_c ">
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute top-0 left-1/3 w-1/2 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-20 blur-2xl transform rotate-45"></div>
                      <div className="absolute top-0 right-1/4 w-1/3 h-full bg-gradient-to-b from-transparent via-green-300 to-transparent opacity-20 blur-2xl transform -rotate-45"></div>

                      <div className="animate-pulse bg-green-300 rounded-full h-24 w-24 opacity-10 blur-lg top-1/3 right-1/4 absolute"></div>
                    </div>
                    {/* 奖励提示 */}
                    <p className="text-center text-3xl font-extrabold text-green-900 mb-3 z-10 relative">
                      🎉 奖励解锁：
                      <br />
                      一块新土地！
                    </p>

                    {/* 奖品图标 */}
                    <div className="d_c_c_c my-12 z-10 relative">
                      <LiLandsBoxSvg
                        width={58}
                        height={58}
                        className="animate-bounce transform hover:scale-110 transition duration-500"
                      />
                      <div className="absolute -top-4 right-6">
                        <span className="animate-ping inline-flex h-4 w-4 rounded-full bg-yellow-400"></span>
                      </div>
                    </div>

                    {/* 领取按钮 */}
                    <div className="w-2/3 mx-auto mb-2 z-10 relative">
                      <Button
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-md hover:shadow-lg transform  transition duration-300"
                        variant="shadow"
                        onClick={handleClaimLand}
                      >
                        领取
                      </Button>
                    </div>

                    <div className="text-center text-sm text-gray-800 z-10 relative">
                      欢迎您的到来！这是我们为您准备的一份欢迎礼。
                    </div>
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    )
  );
}

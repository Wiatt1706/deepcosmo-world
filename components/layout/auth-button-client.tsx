"use client";
import { Button } from "@nextui-org/button";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Session,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Avatar,
  DropdownSection,
  Spinner,
} from "@nextui-org/react";
import Link from "next/link";
import {
  BlockCoinsSvg,
  GithubSvg,
  GoogleSvg,
  LiLandsBoxSvg,
} from "@/components/utils/icons";
import { useUserStore } from "../SocketManager";
import { FirstLoginReward } from "./Rewards";
import { atom, useAtom } from "jotai";
type Provider = "github" | "google";

export const userDataAtom = atom<Profile | null>(null);

export default function AuthButtonClient({
  session,
}: {
  session?: Session | null;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true); // 跟踪加载状态

  const [userData, setUserData] = useAtom(userDataAtom);

  const handleUserData = useCallback(async () => {
    setIsLoading(true);
    if (!session) return;
    let { data: requestDTOs } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session?.user.id);

    setUserData(requestDTOs?.[0] || null);
    setIsLoading(false);
  }, [supabase, setUserData, session]);

  useEffect(() => {
    if (session?.user.id && !userData) {
      handleUserData();
    }
  }, [session?.user.id, handleUserData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return session ? (
    <>
      <FirstLoginReward session={session} onRewardClaimed={handleUserData} />
      <Dropdown
        radius="sm"
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content: "p-0 border-small border-divider bg-background",
        }}
      >
        <DropdownTrigger>
          <Avatar
            className="m-1"
            as="button"
            isBordered
            radius="lg"
            size="sm"
            src={
              session?.user?.user_metadata?.avatar_url || "/images/DefPixel.png"
            }
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Custom item styles"
          disabledKeys={["LandCoins", "BlockCoins"]}
          className="p-3"
          itemClasses={{
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "dark:data-[hover=true]:bg-default-50",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          }}
        >
          <DropdownSection aria-label="Profile & Actions" showDivider>
            <DropdownItem
              isReadOnly
              key="LandCoins"
              className="gap-2 opacity-100 d_c_b"
              endContent={
                isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <p className="flex items-center gap-1 font-bold text-xs text-black">
                    {userData?.land_coins}
                    <LiLandsBoxSvg width={16} height={16} />
                  </p>
                )
              }
            >
              Lands
            </DropdownItem>
            <DropdownItem
              isReadOnly
              key="BlockCoins"
              className="gap-2 opacity-100 d_c_b"
              endContent={
                isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <p className="flex items-center gap-1 font-bold text-xs text-black">
                    {userData?.block_coins}
                    <BlockCoinsSvg width={16} height={16} />
                  </p>
                )
              }
            >
              BlockCoins
            </DropdownItem>
          </DropdownSection>

          <DropdownSection aria-label="help_and_Home & logout">
            <DropdownItem key="help_and_Home" href="/home">
              Home
            </DropdownItem>
            <DropdownItem key="logout" onClick={handleSignOut}>
              Log Out
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  ) : (
    <LoginBtn />
  );
}

const LoginBtn = () => {
  const setCheckLogin = useUserStore((state) => state.setCheckLogin);
  const [loading, setLoading] = useState(false);
  const [clickedBtn, setClickedBtn] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const supabase = createClientComponentClient<Database>();

  // 使用 useEffect 来避免在渲染过程中调用 setCheckLogin
  useEffect(() => {
    setCheckLogin(onOpen); // 只在组件挂载时执行一次
  }, [setCheckLogin, onOpen]); // 依赖 onOpen，确保每次 `onOpen` 改变时触发

  const handleSignIn = (provider: Provider) => {
    setLoading(true);
    setClickedBtn(provider);
    handleAuth(provider);
  };

  const handleAuth = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-[#fff] border-2 border-white shadow"
        size="sm"
        radius="sm"
      >
        登录
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2 text-center">
                  <h2 className="text-xl font-bold">
                    Welcome to DeepCosmo Community
                  </h2>
                  <p className="text-sm px-2">
                    DeepCosmo Community is growing. More content coming soon
                  </p>
                </div>

                <div className="w-full flex flex-col">
                  <Button
                    isLoading={loading && clickedBtn === "github"}
                    onClick={() => handleSignIn("github")}
                    className="flex justify-center items-center py-2 bg-black text-white"
                    isDisabled={loading && clickedBtn !== "github"}
                  >
                    <GithubSvg width={25} height={25} /> Login with Google
                  </Button>

                  <Button
                    variant="bordered"
                    isDisabled={loading && clickedBtn !== "google"}
                    className="flex justify-center items-center py-2 bg-white text-black mt-2"
                    onClick={() => handleSignIn("google")}
                    isLoading={loading && clickedBtn === "google"}
                  >
                    <GoogleSvg width={20} height={20} className="mr-2" /> Login
                    with GitHub
                  </Button>

                  <div className="w-full flex flex-col items-center my-4">
                    <span className="text-gray-400">
                      Already have an account?{" "}
                      <Link href="/login" className="text-blue-500">
                        Log in
                      </Link>
                      .
                    </span>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

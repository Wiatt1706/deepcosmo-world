"use client";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
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
  User,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";
import Link from "next/link";
import { GithubSvg, GoogleSvg } from "@/components/utils/icons";

type Provider = "github" | "google";

export default function AuthButtonClient({
  session,
}: {
  session: Session | null;
}) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return session ? (
    <div className="px-4 flex items-center h-[48px]">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              size: "sm",
              src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            }}
            className="transition-transform"
            name="Tony Reichert"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="analytics" href="/home">
            Home
          </DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  ) : (
    <LoginBtn />
  );
}

const LoginBtn = () => {
  const [loading, setLoading] = useState(false);
  const [clickedBtn, setClickedBtn] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const supabase = createClientComponentClient<Database>();

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
        className="bg-primary text-white border border-conditionalborder-transparent mx-2"
        size="sm"
        radius="none"
      >
        Login
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2 text-center">
                  <h2 className="text-xl font-bold ">
                    Welcome to DeepCosmo Community
                  </h2>
                  <p className="text-sm px-2">
                    DeepCosmo Community is growing. More content coming soon
                  </p>
                </div>

                <div className="w-full flex flex-col ">
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

                  <div className="w-full flex flex-col  items-center my-4">
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

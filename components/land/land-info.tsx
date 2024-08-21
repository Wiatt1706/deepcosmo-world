"use client";
import Link from "next/link";
import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@nextui-org/react";
import {
  TbBox,
  TbBoxModel,
  TbBoxModel2,
  TbBoxMultiple2,
  TbDotsVertical,
  TbEdit,
  TbLetterX,
  TbLetterXSmall,
  TbLink,
  TbMultiplier1X,
  TbPencil,
  TbShare,
  TbSquare1Filled,
  TbSquare2Filled,
  TbSquare3Filled,
  TbTrash,
} from "react-icons/tb";

export default function Lands({ lands }: { lands: LandWithAuthor[] }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  console.log(lands);

  useEffect(() => {
    const channel = supabase
      .channel("realtime lands")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "land_info",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const getIconByLandType = (landType?: string | null) => {
    switch (landType) {
      case "0":
        return <TbBoxModel size={20} />;
      case "1":
        return <TbBoxModel2 size={20} />;
      case "2":
        return <TbBoxMultiple2 size={20} />;
      // Add more cases as needed
      default:
        return <TbBox size={20} color="#20272c" />; // Default icon
    }
  };
  const getIconByLandLevel = (landLevel?: string | null) => {
    switch (landLevel) {
      case "1":
        return <TbSquare1Filled size={20} color="#0070f0" />;
      case "2":
        return <TbSquare2Filled size={20} color="#0070f0" />;
      case "3":
        return <TbSquare3Filled size={20} color="#0070f0" />;
      // Add more cases as needed
      default:
        return "1x1"; // Default icon
    }
  };
  return (
    <div className="w-full max-w-[1500px] gap-4 grid grid-cols-12">
      {lands.map((land) => (
        <Card
          key={land.id}
          isFooterBlurred
          radius="sm"
          className="w-full h-[200px] col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2 border-2 group shadow-none"
        >
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <div className="flex w-40px h-40px items-center justify-center bg-white/10 rounded text-white/60 uppercase font-bold">
              {getIconByLandType(land.land_type)}
            </div>
          </CardHeader>
          <Image
            removeWrapper
            alt="Card example background"
            className="z-0 w-full -translate-y-[20px] object-cover"
            src={land.cover_icon_url || "/images/pixel_map_1.jpg"}
          />
          <CardFooter className="absolute bg-white/90 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div>
              <p className="text-black text-sm">{land.land_name}</p>
              <div className="text-black text-xs flex gap-1 items-center text-[#20272c] font-bold">
                {getIconByLandLevel(land.land_level)}
                {land.world_coordinates_x}, {land.world_coordinates_y}
              </div>
            </div>

            <div className="hidden group-hover:block">
              <Dropdown radius="sm">
                <DropdownTrigger>
                  <Button
                    radius="full"
                    size="sm"
                    isIconOnly
                    variant="light"
                    startContent={<TbDotsVertical size={20} color="#20272c" />}
                  />
                </DropdownTrigger>
                <DropdownMenu
                  className="text-[#3d4852]"
                  variant="faded"
                  aria-label="Dropdown menu with description"
                >
                  <DropdownItem
                    key="TbEdit"
                    startContent={<TbPencil size={20} />}
                  >
                    Rename
                  </DropdownItem>
                  <DropdownItem
                    key="TbEdit"
                    href={`/landInfo/${land.id}`}
                    startContent={<TbEdit size={20} />}
                  >
                    Edit Lands
                  </DropdownItem>
                  <DropdownItem
                    key="TbShare"
                    startContent={<TbShare size={20} />}
                  >
                    Share
                  </DropdownItem>
                  <DropdownItem
                    key="CopyShareLink"
                    showDivider
                    startContent={<TbLink size={20} />}
                  >
                    Copy share link
                  </DropdownItem>

                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<TbTrash size={20} />}
                  >
                    Delete land
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

"use client";

import styles from "@/styles/canvas/ViewLeftInfo.module.css";
import { Button, Image, Skeleton, Spinner } from "@nextui-org/react";
import { clsx } from "clsx";
import {
  TbBookmark,
  TbBookmarkFilled,
  TbDoor,
  TbMapPin,
  TbPhotoPlus,
  TbShare,
  TbUser,
  TbX,
} from "react-icons/tb";
import { useEffect, useState } from "react";
import { selectedPixelBlockAtom } from "../../store/ShowBaseAtomStore";
import { useAtom } from "jotai";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LAND_LEVEL, LAND_TYPE, OPTION_TEST_LIST4 } from "@/types/MapTypes";
import PhotoSlider from "@/components/utils/PhotoGallery";

export default function LeftInfoView() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixelBlock, setPixelBlock] = useState<any | null>(null);

  const [selectedPixelBlock, setSelectedPixelBlock] = useAtom(
    selectedPixelBlockAtom
  );
  useEffect(() => {
    setLoading(true);
    if (selectedPixelBlock) {
      const fetchPixelBlocks = async () => {
        setError(null); // Reset error before the request
        try {
          let { data, error } = await supabase
            .from("land_info")
            .select("*,author: profiles(*),ShowCoverImg(*)")
            .eq("id", selectedPixelBlock.id);

          if (error) throw new Error(error.message);

          console.log(data);

          const fetchedBlocks: any[] =
            data?.map((requestDTO: any) => {
              return {
                id: requestDTO.id,
                name: requestDTO.land_name,
                description: requestDTO.land_description,
                x: requestDTO.world_coordinates_x,
                y: requestDTO.world_coordinates_y,
                width: requestDTO.world_size_x,
                height: requestDTO.world_size_y,
                color: requestDTO.fill_color,
                borderSize: requestDTO.border_size,
                blockCount: requestDTO.block_count,
                type: parseInt(requestDTO.land_type),
                status: parseInt(requestDTO.land_status),
                landCoverImg: requestDTO.cover_icon_url, // 如果没有封面图片，则设置为undefined
                showCoverImgList: requestDTO.show_cover_list,
                skipUrl: requestDTO.skip_url, // 处理可选的跳转URL
                useExternalLink: requestDTO.use_external_link, // 布尔值直接映射
                externalLinkType: requestDTO.external_link_type, // 处理可选的外部链接类型
                externalLink: requestDTO.external_link, // 处理可选的外部链接
                author: requestDTO.author,
                isInland: requestDTO.is_inland,
                landLevel: requestDTO.land_level,
              };
            }) || [];
          setPixelBlock(fetchedBlocks[0] ?? null);
        } catch (err) {
          setError("An error occurred while fetching data.");
        } finally {
          setLoading(false);
        }
      };
      fetchPixelBlocks();
    }
  }, [selectedPixelBlock]);

  return (
    <div
      className={clsx(
        styles["info-view"],
        "",
        selectedPixelBlock ? "block" : "hidden"
      )}
    >
      <div className={styles["columnGgroup"] + " border-b"}>
        <div className={styles["col-title"]}>
          <h2 className={clsx([styles["col"], styles["title"]])}>
            #{`Land_${selectedPixelBlock?.x}_${selectedPixelBlock?.y}`}
          </h2>
          <Button
            variant="light"
            isIconOnly
            endContent={<TbX size={20} />}
            className="text-[#63727E]"
            size="sm"
            onClick={() => setSelectedPixelBlock(null)}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 mt-[100px] d_c_c_c">
          <Spinner color="primary" size="lg" />
        </div>
      ) : (
        pixelBlock && <ViewLeftInfo pixelBlock={pixelBlock} />
      )}
    </div>
  );
}

const ViewLeftInfo = ({ pixelBlock }: any) => {
  return (
    <div className={clsx([styles["col-group"]])}>
      <div
        className={clsx(styles["photoSliderContainer"], styles["photoSlider"])}
      >
        {pixelBlock.showCoverImgList?.length ?? 0 ? (
          <PhotoSlider
            photos={
              pixelBlock.showCoverImgList ? pixelBlock.showCoverImgList : []
            }
            iframeSrc={pixelBlock.externalLink}
          />
        ) : (
          <div className="w-full cursor-pointer bg-[#f9f9f9] h-[200px] flex justify-center items-center hover:bg-[#f5f5f5]">
            <Image
              height={200}
              alt="Pixel block Image"
              src="/images/DefBag.png"
              className="object-cover rounded-none"
            />
          </div>
        )}
      </div>
      <div className="px-6 py-4">
        <div className={styles["col-title"]}>
          <div className="flex flex-col">
            <p>{pixelBlock.name}</p>
            <p className="text-[#70757a] text-xs">
              {`#${`${pixelBlock.x}, ${pixelBlock.y}`}`}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-b w-full p-3 d_c_c gap-9 ">
        <IconButton
          icon={<TbBookmarkFilled size={16} strokeWidth={1.5} />}
          filled
          label="保存"
          onClick={() => {}}
        />
        {pixelBlock.isInland && (
          <IconButton
            icon={<TbDoor size={16} strokeWidth={2} />}
            label="进入"
            filled
            onClick={() => {
              console.log("分享");
            }}
          />
        )}

        <IconButton
          icon={<TbMapPin size={16} strokeWidth={1.5} />}
          label="定位"
          onClick={() => {}}
        />
        <IconButton
          icon={<TbShare size={16} strokeWidth={1.5} />}
          label="分享"
          onClick={() => {
            console.log("分享");
          }}
        />
      </div>

      <div className="flex items-center text-[14px] p-4 gap-2 border-b">
        <div className="min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] border border hover:border-[#006fef] p-1 m-1 overflow-hidden ">
          <Image
            width={64}
            height={64}
            alt="Pixel block Image"
            src={pixelBlock.landCoverImg || "/images/DefPixel.png"}
            className="object-cover rounded-sm"
          />
        </div>
        <div className="d_c_c gap-2">
          <div className="flex flex-col px-2 gap-1">
            <span className="text-[14px] font-semibold">大小</span>
            <span>{LAND_LEVEL[Number(pixelBlock.landLevel || 0)]?.name}</span>
          </div>

          <div className="flex flex-col px-2 gap-1">
            <span className="text-[14px] font-semibold">状态</span>
            <span>
              {OPTION_TEST_LIST4[Number(pixelBlock.status || 0)]?.name}
            </span>
          </div>

          <div className="flex flex-col px-2 gap-1">
            <span className="text-[14px] font-semibold">类型</span>
            <span>{LAND_TYPE[Number(pixelBlock.type || 0)]?.name}</span>
          </div>
        </div>
      </div>

      {pixelBlock.description && (
        <div className="border-b p-6">
          <h2 className={clsx([styles["title"]]) + " mb-1"}>概况</h2>
          <p className=" text-[#70757a] text-sm">{pixelBlock.description}</p>
        </div>
      )}

      <div className="w-full p-3">
        <div className="flex gap-2 px-3 items-center hover:bg-[#f9f9f9]">
          <TbUser
            size={20}
            strokeWidth={3}
            color="#1a73e8"
            className="m-2 mr-4"
          />
          <span className="text-[#272727] text-sm">
            {pixelBlock.author.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export const IconButton = ({
  icon,
  label,
  filled,
  onClick,
}: {
  icon: JSX.Element;
  label: string;
  filled?: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className="cursor-pointer d_c_c_c gap-1 text-[#1a73e8] text-xs group"
      onClick={onClick}
    >
      <div
        className={`w-[36px] h-[36px] d_c_c border border-[#1a73e8] rounded-full ${
          filled
            ? "text-[#e8f0fe] bg-[#1a73e8] group-hover:bg-[#1967d2]"
            : "text-[#1967d2] group-hover:bg-[#e8f0fe]"
        }`}
      >
        {icon}
      </div>
      <span>{label}</span>
    </div>
  );
};

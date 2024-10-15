import { PixelBlock } from "@/types/MapTypes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

type QueryCondition = {
  column: string;
  value: any;
};

export function useQueryPixelBlockByColumn({ column, value }: QueryCondition) {
  const supabase = createClientComponentClient();
  const [pixelBlocks, setPixelBlocks] = useState<PixelBlock[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) return;

    const fetchPixelBlocks = async () => {
      setLoading(true);
      setError(null); // Reset error before the request

      try {
        let { data, error } = await supabase
          .from("land_info")
          .select("*,author: profiles(*),ShowCoverImg(*)")
          .eq(column, value);

        if (error) throw new Error(error.message);

        const fetchedBlocks: PixelBlock[] =
          data?.map((requestDTO: Land) => {
            return {
              id: requestDTO.id,
              name: requestDTO.land_name,
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
            } as PixelBlock;
          }) || [];
        setPixelBlocks(fetchedBlocks ?? []);
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPixelBlocks();
  }, [column, value, supabase]);

  return { pixelBlocks, loading, error };
}

import { PixelBlock } from "@/types/MapTypes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";

type QueryCondition = {
  column: string;
  value: any;
};

export function useUserCustomItemBlock({ column, value }: QueryCondition) {
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
        const { data, error } = await supabase
          .from("UserCustomItem")
          .select(
            `land_info(
              id,
              land_name,
              world_coordinates_x,
              world_coordinates_y,
              world_size_x,
              world_size_y,
              fill_color,
              border_size,
              block_count,
              land_type,
              land_status,
              cover_icon_url
            )`
          )
          .eq(column, value);

        if (error) throw new Error(error.message);

        const fetchedBlocks = data?.map((item: any) => ({
          id: item.land_info.id,
          name: item.land_info.land_name,
          x: item.land_info.world_coordinates_x,
          y: item.land_info.world_coordinates_y,
          width: item.land_info.world_size_x,
          height: item.land_info.world_size_y,
          color: item.land_info.fill_color,
          borderSize: item.land_info.border_size,
          blockCount: item.land_info.block_count,
          type: parseInt(item.land_info.land_type),
          status: parseInt(item.land_info.land_status),
          landCoverImg: item.land_info.cover_icon_url,
        }));
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

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { PixelBlock } from "@/types/MapTypes";
import { LandInfoService } from "@/utils/serviceimpl";

export async function POST(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {
        // 获取请求中的 pixelBlocks 数组和 parent_land_id
        const requestDTOs: PixelBlock[] = requestBody.pixelBlocks;
        const parentLandId: string | null = requestBody.parent_land_id || null;

        if (!requestDTOs || requestDTOs.length === 0 || !parentLandId) {
            return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { data: userInfo, error: userInfoError } = await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        const userId = userInfo.user?.id as string;

        // 遍历 requestDTOs 数组，生成对应的 Land 对象列表
        const dataList: Land[] = requestDTOs.map((requestDTO) => {
            const capacitySize = requestDTO.usedBlocks * 100;
            const landLevel = Math.sqrt(requestDTO.usedBlocks);
            const showCoverImgList = requestDTO.showCoverImgList; // 展示图清单
            // 文件上传处理（如果有需要，可以在这里添加）

            return {
                land_owner: userId,
                world_coordinates_x: requestDTO.x,
                world_coordinates_y: requestDTO.y,
                world_size_x: requestDTO.width,
                world_size_y: requestDTO.height,
                size: [requestDTO.width, requestDTO.height],
                operate_status: requestDTO.status ?? 0,
                land_name: requestDTO.name ?? `Land_${requestDTO.x}_${requestDTO.y}`,
                cover_icon_url: requestDTO.landCoverImg?.src ?? null,
                use_external_link: requestDTO.useExternalLink ?? false,
                external_link_type: requestDTO.externalLinkType ?? null,
                external_link: requestDTO.externalLink ?? null,
                parent_land_id: parentLandId,
                land_type: requestDTO.type.toString(),
                land_level: landLevel.toString(),
                capacity_size: capacitySize,
                // 添加其他的必要映射字段，或者设置为 null/默认值
                used_pixel_blocks: 0,
                is_open: false,
                is_inland: false,
                land_description: null,
                model_url: null,
                system_data: null,
                created_at: new Date().toISOString(),
            } as Land;
        });

        // 将生成的 Land 对象列表保存到数据库
        await LandInfoService.saveRecord(supabase, dataList);

        return new Response(JSON.stringify({ data: true, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}




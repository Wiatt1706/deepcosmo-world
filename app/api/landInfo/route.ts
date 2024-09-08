import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Photo, PixelBlock } from "@/types/MapTypes";
import { LandInfoService } from "@/utils/serviceimpl";
import { Json } from "@/types/database.types";

export async function POST(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {
        // 获取请求中的 pixelBlocks 数组和 parent_land_id
        const requestDTOs: PixelBlock[] = requestBody.pixelBlocks;
        const parentLandId: string | null = requestBody.parentLandId || null;

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
            const capacitySize = requestDTO.blockCount * 100;
            let show_cover_list: Json[] | null = null;

            if (requestDTO.showCoverImgList) {
                show_cover_list = requestDTO.showCoverImgList.map(photo => {
                    return {
                        id: photo.id,
                        src: photo.src,
                        // 如果有其他字段，确保它们也是 JSON 兼容类型
                    } as Json;
                });
            }

            // 文件上传处理（如果有需要，可以在这里添加）
            return {
                land_owner: userId,
                parent_land_id: parentLandId,
                world_coordinates_x: requestDTO.x,
                world_coordinates_y: requestDTO.y,
                world_size_x: requestDTO.width,
                world_size_y: requestDTO.height,
                land_name: requestDTO.name ?? `Land_${requestDTO.x}_${requestDTO.y}`,
                cover_icon_url: requestDTO.landCoverImg,
                use_external_link: requestDTO.useExternalLink ?? false,
                external_link_type: requestDTO.externalLinkType,
                external_link: requestDTO.externalLink,
                land_type: requestDTO.type.toString(),
                land_level: Math.sqrt(requestDTO.blockCount).toString(),
                land_status: requestDTO.status ?? "0",
                capacity_size: capacitySize,
                border_size: requestDTO.borderSize ?? 0,
                skip_url: requestDTO.skipUrl,
                block_count: requestDTO.blockCount ?? 1,
                fill_color: requestDTO.color,
                show_cover_list: show_cover_list
            } as Land;
        });

        // 将生成的 Land 对象列表保存到数据库
        await LandInfoService.saveRecord(supabase, dataList);

        return new Response(JSON.stringify({ data: true, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}

export async function PUT(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {

        // 获取请求中的 updatedBlocks 数组和 parent_land_id
        const updatedBlocks: Partial<any>[] = requestBody.updatedBlocks;
        const parentLandId: string | null = requestBody.parentLandId || null;

        if (!updatedBlocks || updatedBlocks.length === 0 || !parentLandId) {
            return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { data: userInfo, error: userInfoError } = await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }

        // 遍历 updatedBlocks 数组，生成对应的部分更新对象列表
        for (const updatedBlock of updatedBlocks) {
            if (!updatedBlock.id) {
                return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
            const updateData: Partial<Land> = {};

            if (updatedBlock.width !== undefined) updateData.world_size_x = updatedBlock.width;
            if (updatedBlock.height !== undefined) updateData.world_size_y = updatedBlock.height;
            if (updatedBlock.name !== undefined) updateData.land_name = updatedBlock.name;
            if (updatedBlock.landCoverImg !== undefined) updateData.cover_icon_url = updatedBlock.landCoverImg;
            if (updatedBlock.useExternalLink !== undefined) updateData.use_external_link = updatedBlock.useExternalLink;
            if (updatedBlock.externalLinkType !== undefined) updateData.external_link_type = updatedBlock.externalLinkType;
            if (updatedBlock.externalLink !== undefined) updateData.external_link = updatedBlock.externalLink;
            if (updatedBlock.type !== undefined) updateData.land_type = updatedBlock.type.toString();
            if (updatedBlock.blockCount !== undefined) {
                updateData.land_level = Math.sqrt(updatedBlock.blockCount).toString();
                updateData.capacity_size = updatedBlock.blockCount * 100;
                updateData.block_count = updatedBlock.blockCount;
            }
            if (updatedBlock.status !== undefined) updateData.land_status = updatedBlock.status.toString();
            if (updatedBlock.borderSize !== undefined) updateData.border_size = updatedBlock.borderSize;
            if (updatedBlock.skipUrl !== undefined) updateData.skip_url = updatedBlock.skipUrl;
            if (updatedBlock.color !== undefined) updateData.fill_color = updatedBlock.color.toString();
            if (updatedBlock.showCoverImgList !== undefined) {
                updateData.show_cover_list = updatedBlock.showCoverImgList.map((photo: Photo) => ({
                    id: photo.id,
                    src: photo.src,
                }));
            }

            // 进行数据库更新操作
            const { error } = await supabase
                .from("land_info")
                .update(updateData)
                .eq("parent_land_id", parentLandId)
                .eq("id", updatedBlock.id)

            if (error) {
                console.error("LandInfoService.upsertRecord error:", error);
            }
        }

        return new Response(JSON.stringify({ data: true, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}



export async function DELETE(request: Request) {
    const requestBody = await request.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });

    try {
        // 获取请求中的 pixelBlocks 数组和 parent_land_id
        const requestDTOs: { x: number, y: number }[] = requestBody.pixelBlocks;
        const parentLandId: string | null = requestBody.parentLandId || null;

        if (!requestDTOs || requestDTOs.length === 0 || !parentLandId) {
            return new Response(JSON.stringify({ error: "请提供合法入参" }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        const { data: userInfo, error: userInfoError } = await supabase.auth.getUser();

        if (!userInfo || userInfoError) {
            return new Response(JSON.stringify({ error: "用户未登录" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }


        for (let index = 0; index < requestDTOs.length; index++) {
            const { error } = await supabase
                .from("land_info")
                .delete()
                .eq("parent_land_id", parentLandId)
                .eq("world_coordinates_x", requestDTOs[index].x)
                .eq("world_coordinates_y", requestDTOs[index].y);
            if (error) {
                console.error("LandInfoService.deleteRecord error:", error);
            }
        }

        return new Response(JSON.stringify({ data: true, message: "操作成功" }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}


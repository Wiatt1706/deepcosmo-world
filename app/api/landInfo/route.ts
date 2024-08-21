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
            // 文件上传处理（如果有需要，可以在这里添加）
            return {
                land_owner: userId,
                world_coordinates_x: requestDTO.x,
                world_coordinates_y: requestDTO.y,
                world_size_x: requestDTO.width,
                world_size_y: requestDTO.height,
                land_name: requestDTO.name ?? `Land_${requestDTO.x}_${requestDTO.y}`,
                cover_icon_url: requestDTO.landCoverImg,
                use_external_link: requestDTO.useExternalLink ?? false,
                external_link_type: requestDTO.externalLinkType,
                external_link: requestDTO.externalLink,
                parent_land_id: parentLandId,
                land_type: requestDTO.type.toString(),
                land_level: Math.sqrt(requestDTO.blockCount).toString(),
                land_status: requestDTO.status ?? "0",
                capacity_size: capacitySize,
                block_count: requestDTO.blockCount,
                fill_color: requestDTO.color,
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

        // 遍历 requestDTOs 数组，生成对应的 Land 对象列表
        const dataList: Land[] = requestDTOs.map((requestDTO) => {
            // 文件上传处理（如果有需要，可以在这里添加）
            return {
                world_coordinates_x: requestDTO.x,
                world_coordinates_y: requestDTO.y,
                world_size_x: requestDTO.width,
                world_size_y: requestDTO.height,
                land_name: requestDTO.name,
                cover_icon_url: requestDTO.landCoverImg,
                use_external_link: requestDTO.useExternalLink,
                external_link_type: requestDTO.externalLinkType,
                external_link: requestDTO.externalLink,
                land_type: requestDTO.type.toString(),
                land_level: Math.sqrt(requestDTO.blockCount).toString(),
                land_status: requestDTO.status ?? "0",
                capacity_size: requestDTO.blockCount * 100,
                border_size: requestDTO.borderSize,
                skip_url: requestDTO.skipUrl,
                block_count: requestDTO.blockCount,
                fill_color: requestDTO.color,
            } as Land;
        });

        console.log("LandInfoService.upsertRecord dataList:", dataList);

        for (let index = 0; index < dataList.length; index++) {
            const { error } = await supabase
                .from("land_info")
                .update(dataList[0])
                .eq("parent_land_id", parentLandId)
                .eq("world_coordinates_x", dataList[index].world_coordinates_x)
                .eq("world_coordinates_y", dataList[index].world_coordinates_y)
                ;
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


import { Database as DB } from "@/types/database.types"

declare global {
    type Database = DB
    type Land = DB["public"]["Tables"]["land_info"]["Row"];
    type Product = DB["public"]["Tables"]["ProductsInfo"]["Row"];
    type PxCmtyArticles = DB["public"]["Tables"]["PxCmtyArticles"]["Row"];
    type PostVO = PxCmtyArticles & { likeArray: boolean[] | null, isReject: boolean | null, Keyword: any };
    type Keyword = DB["public"]["Tables"]["Keyword"]["Row"];
    type BlockModels = DB["public"]["Tables"]["block_models"]["Row"];
    type Profile = DB["public"]["Tables"]["profiles"]["Row"];
    type LandWithAuthor = Land & {
        author: Profile;
        likes: number;
        user_has_liked_land: boolean;
    };
}
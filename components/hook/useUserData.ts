import { useEffect, useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { atom, useAtom } from "jotai";
import { Session } from "@supabase/auth-helpers-nextjs";

export const userDataAtom = atom<Profile | null>(null);

export function useUserData(session?: Session | null) {
    const supabase = createClientComponentClient();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useAtom(userDataAtom);

    const fetchUserData = useCallback(async () => {
        if (!session) return;

        setIsLoading(true);
        try {
            const { data: profiles, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id);

            if (error) {
                console.error("Error fetching user data:", error.message);
                setUserData(null);
            } else {
                setUserData(profiles?.[0] || null);
            }
        } finally {
            setIsLoading(false);
        }
    }, [session, supabase, setUserData]);

    useEffect(() => {
        if (session?.user.id && !userData) {
            fetchUserData();
        }
    }, [session?.user.id, fetchUserData, userData]);

    return { userData, isLoading, fetchUserData };
}

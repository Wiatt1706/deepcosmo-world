"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";
import { useUserData } from "./hook/useUserData";

// 用户上下文
const UserContext = createContext<any>(null);

// 提供用户数据的上下文组件
export function UserProvider({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const { userData } = useUserData(session);
  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}

// 自定义 Hook 获取用户数据
export function useUserDataContext() {
  return useContext(UserContext);
}

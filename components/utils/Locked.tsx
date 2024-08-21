import React, { ReactNode } from "react";

interface LockedProps<T> {
  isLocked: boolean;
  lockMessage: ReactNode;
  children: ReactNode;
}

const Locked = <T,>({ isLocked, lockMessage, children }: LockedProps<T>) => {
  return <>{isLocked ? lockMessage : children}</>;
};

export default Locked;

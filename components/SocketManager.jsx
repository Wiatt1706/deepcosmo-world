import { useEffect } from "react";

import { atom, useAtom } from "jotai";

export const controlStatusAtom = atom({
  isSpaceDown: false,
  isMouseDown: false,
  defStage: 0,
});

export const mouseStageAtom = atom(0);

export const SocketManager = () => {
  const [controlStatus, setControlStatus] = useAtom(controlStatusAtom);
};

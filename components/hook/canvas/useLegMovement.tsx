import { Character } from "@/types/CanvasTypes";
import { useEffect, useState } from "react";

export const useLegMovement = (keys: any, player: Character) => {
  const [legOffsetY, setLegOffsetY] = useState(0);
  const [legOffsetX, setLegOffsetX] = useState(0);
  const [swingDirection, setSwingDirection] = useState(1);

  useEffect(() => {
    const LEG_OFFSET = player.radius * 0.5; // Adjust the initial leg offset based on player radius
    const LEG_SWING_RANGE = player.speed * 3; // Adjust the swing range based on player speed
    const LEG_SWING_SPEED = player.speed * 0.3; // Adjust the swing speed based on player speed

    setLegOffsetX(LEG_OFFSET); // Set the initial leg offset

    const updateLegMovement = () => {
      if (keys.up || keys.down) {
        setLegOffsetY((prev) => {
          let newOffset = prev + swingDirection * LEG_SWING_SPEED;
          if (newOffset > LEG_SWING_RANGE || newOffset < -LEG_SWING_RANGE) {
            setSwingDirection(-swingDirection);
            newOffset = prev + swingDirection * LEG_SWING_SPEED;
          }
          return newOffset;
        });
      } else if (keys.left || keys.right) {
        setLegOffsetY((prev) => {
          let newOffset = prev + swingDirection * LEG_SWING_SPEED;
          if (newOffset > LEG_SWING_RANGE || newOffset < -LEG_SWING_RANGE) {
            setSwingDirection(-swingDirection);
            newOffset = prev + swingDirection * LEG_SWING_SPEED;
          }
          return newOffset;
        });
      } else {
        setLegOffsetY(0);
        setLegOffsetX(LEG_OFFSET); // Reset leg offset to the initial value based on player radius
      }
    };

    const intervalId = setInterval(updateLegMovement, 16);
    return () => clearInterval(intervalId);
  }, [keys, swingDirection, player.radius, player.speed]);

  return { legOffsetX, legOffsetY };
};

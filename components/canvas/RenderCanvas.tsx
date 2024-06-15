"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/canvas/canvas.module.css";
import { BoardProps, Character, Geometry } from "@/types/CanvasTypes";
import { drawCharacterViewpoints } from "./helpers/LightDraw";
import { useBaseKeyPress } from "../hook/useKeyPress";
import { handleCollision } from "@/components/canvas/helpers/PhysicsDraw";
import { drawCircle } from "./helpers/BaseDraw";

const GeometryList: Geometry[] = [
  {
    name: "Polygon #1",
    type: 0,
    segments: [
      {
        a: {
          x: 1021,
          y: 387,
        },
        b: {
          x: 1071,
          y: 387,
        },
      },
      {
        a: {
          x: 1071,
          y: 387,
        },
        b: {
          x: 1071,
          y: 437,
        },
      },
      {
        a: {
          x: 1071,
          y: 437,
        },
        b: {
          x: 1021,
          y: 437,
        },
      },
      {
        a: {
          x: 1021,
          y: 437,
        },
        b: {
          x: 1021,
          y: 387,
        },
      },
      {
        a: {
          x: 1278.2403678135413,
          y: 389.2427014269094,
        },
        b: {
          x: 1277.7572985730906,
          y: 439.2403678135411,
        },
      },
      {
        a: {
          x: 1277.7572985730906,
          y: 439.2403678135411,
        },
        b: {
          x: 1020.7596321864588,
          y: 436.7572985730906,
        },
      },
      {
        a: {
          x: 1020.7596321864588,
          y: 436.7572985730906,
        },
        b: {
          x: 1021.2427014269093,
          y: 386.7596321864589,
        },
      },
      {
        a: {
          x: 1021.2427014269093,
          y: 386.7596321864589,
        },
        b: {
          x: 1278.2403678135413,
          y: 389.2427014269094,
        },
      },
    ],
  },
  {
    name: "Polygon #2",
    type: 0,
    segments: [
      {
        a: {
          x: 1017,
          y: 388,
        },
        b: {
          x: 1067,
          y: 388,
        },
      },
      {
        a: {
          x: 1067,
          y: 388,
        },
        b: {
          x: 1067,
          y: 438,
        },
      },
      {
        a: {
          x: 1067,
          y: 438,
        },
        b: {
          x: 1017,
          y: 438,
        },
      },
      {
        a: {
          x: 1017,
          y: 438,
        },
        b: {
          x: 1017,
          y: 388,
        },
      },
      {
        a: {
          x: 1068.3447778206328,
          y: 509.65040034609495,
        },
        b: {
          x: 1018.349599653905,
          y: 510.3447778206328,
        },
      },
      {
        a: {
          x: 1018.349599653905,
          y: 510.3447778206328,
        },
        b: {
          x: 1016.6552221793672,
          y: 388.34959965390505,
        },
      },
      {
        a: {
          x: 1016.6552221793672,
          y: 388.34959965390505,
        },
        b: {
          x: 1066.650400346095,
          y: 387.6552221793672,
        },
      },
      {
        a: {
          x: 1066.650400346095,
          y: 387.6552221793672,
        },
        b: {
          x: 1068.3447778206328,
          y: 509.65040034609495,
        },
      },
    ],
  },
  {
    name: "Polygon #3",
    type: 0,
    segments: [
      {
        a: {
          x: 1274,
          y: 322,
        },
        b: {
          x: 1324,
          y: 322,
        },
      },
      {
        a: {
          x: 1324,
          y: 322,
        },
        b: {
          x: 1324,
          y: 372,
        },
      },
      {
        a: {
          x: 1324,
          y: 372,
        },
        b: {
          x: 1274,
          y: 372,
        },
      },
      {
        a: {
          x: 1274,
          y: 372,
        },
        b: {
          x: 1274,
          y: 322,
        },
      },
      {
        a: {
          x: 1321.6296898401426,
          y: 508.3649044622364,
        },
        b: {
          x: 1271.6350955377636,
          y: 507.62968984014253,
        },
      },
      {
        a: {
          x: 1271.6350955377636,
          y: 507.62968984014253,
        },
        b: {
          x: 1274.3703101598574,
          y: 321.6350955377636,
        },
      },
      {
        a: {
          x: 1274.3703101598574,
          y: 321.6350955377636,
        },
        b: {
          x: 1324.3649044622364,
          y: 322.37031015985747,
        },
      },
      {
        a: {
          x: 1324.3649044622364,
          y: 322.37031015985747,
        },
        b: {
          x: 1321.6296898401426,
          y: 508.3649044622364,
        },
      },
      {
        a: {
          x: 1388,
          y: 458,
        },
        b: {
          x: 1388,
          y: 508,
        },
      },
      {
        a: {
          x: 1388,
          y: 508,
        },
        b: {
          x: 1272,
          y: 508,
        },
      },
      {
        a: {
          x: 1272,
          y: 508,
        },
        b: {
          x: 1272,
          y: 458,
        },
      },
      {
        a: {
          x: 1272,
          y: 458,
        },
        b: {
          x: 1388,
          y: 458,
        },
      },
    ],
  },
  {
    name: "Polygon #4",
    type: 0,
    segments: [
      {
        a: {
          x: 1466,
          y: 456,
        },
        b: {
          x: 1516,
          y: 456,
        },
      },
      {
        a: {
          x: 1516,
          y: 456,
        },
        b: {
          x: 1516,
          y: 506,
        },
      },
      {
        a: {
          x: 1516,
          y: 506,
        },
        b: {
          x: 1466,
          y: 506,
        },
      },
      {
        a: {
          x: 1466,
          y: 506,
        },
        b: {
          x: 1466,
          y: 456,
        },
      },
      {
        a: {
          x: 1576,
          y: 456,
        },
        b: {
          x: 1576,
          y: 506,
        },
      },
      {
        a: {
          x: 1576,
          y: 506,
        },
        b: {
          x: 1466,
          y: 506,
        },
      },
      {
        a: {
          x: 1466,
          y: 506,
        },
        b: {
          x: 1466,
          y: 456,
        },
      },
      {
        a: {
          x: 1466,
          y: 456,
        },
        b: {
          x: 1576,
          y: 456,
        },
      },
      {
        a: {
          x: 1526,
          y: 396,
        },
        b: {
          x: 1576,
          y: 396,
        },
      },
      {
        a: {
          x: 1576,
          y: 396,
        },
        b: {
          x: 1576,
          y: 506,
        },
      },
      {
        a: {
          x: 1576,
          y: 506,
        },
        b: {
          x: 1526,
          y: 506,
        },
      },
      {
        a: {
          x: 1526,
          y: 506,
        },
        b: {
          x: 1526,
          y: 396,
        },
      },
    ],
  },
  {
    name: "Polygon #5",
    type: 0,
    segments: [
      {
        a: {
          x: 1528,
          y: 583,
        },
        b: {
          x: 1578,
          y: 583,
        },
      },
      {
        a: {
          x: 1578,
          y: 583,
        },
        b: {
          x: 1578,
          y: 633,
        },
      },
      {
        a: {
          x: 1578,
          y: 633,
        },
        b: {
          x: 1528,
          y: 633,
        },
      },
      {
        a: {
          x: 1528,
          y: 633,
        },
        b: {
          x: 1528,
          y: 583,
        },
      },
    ],
  },
  {
    name: "Polygon #6",
    type: 0,
    segments: [
      {
        a: {
          x: 1016,
          y: 638,
        },
        b: {
          x: 1066,
          y: 638,
        },
      },
      {
        a: {
          x: 1066,
          y: 638,
        },
        b: {
          x: 1066,
          y: 688,
        },
      },
      {
        a: {
          x: 1066,
          y: 688,
        },
        b: {
          x: 1016,
          y: 688,
        },
      },
      {
        a: {
          x: 1016,
          y: 688,
        },
        b: {
          x: 1016,
          y: 638,
        },
      },
    ],
  },
  {
    name: "Polygon #7",
    type: 0,
    segments: [
      {
        a: {
          x: 1018,
          y: 690,
        },
        b: {
          x: 1068,
          y: 690,
        },
      },
      {
        a: {
          x: 1068,
          y: 690,
        },
        b: {
          x: 1068,
          y: 740,
        },
      },
      {
        a: {
          x: 1068,
          y: 740,
        },
        b: {
          x: 1018,
          y: 740,
        },
      },
      {
        a: {
          x: 1018,
          y: 740,
        },
        b: {
          x: 1018,
          y: 690,
        },
      },
      {
        a: {
          x: 1068,
          y: 760,
        },
        b: {
          x: 1018,
          y: 760,
        },
      },
      {
        a: {
          x: 1018,
          y: 760,
        },
        b: {
          x: 1018,
          y: 690,
        },
      },
      {
        a: {
          x: 1018,
          y: 690,
        },
        b: {
          x: 1068,
          y: 690,
        },
      },
      {
        a: {
          x: 1068,
          y: 690,
        },
        b: {
          x: 1068,
          y: 760,
        },
      },
      {
        a: {
          x: 1579.19492282775,
          y: 714.1964546142347,
        },
        b: {
          x: 1578.8035453857656,
          y: 764.1949228277499,
        },
      },
      {
        a: {
          x: 1578.8035453857656,
          y: 764.1949228277499,
        },
        b: {
          x: 1017.8050771722501,
          y: 759.8035453857653,
        },
      },
      {
        a: {
          x: 1017.8050771722501,
          y: 759.8035453857653,
        },
        b: {
          x: 1018.1964546142347,
          y: 709.8050771722501,
        },
      },
      {
        a: {
          x: 1018.1964546142347,
          y: 709.8050771722501,
        },
        b: {
          x: 1579.19492282775,
          y: 714.1964546142347,
        },
      },
    ],
  },
  {
    name: "Polygon #8",
    type: 0,
    segments: [
      {
        a: {
          x: 1271,
          y: 198,
        },
        b: {
          x: 1321,
          y: 198,
        },
      },
      {
        a: {
          x: 1321,
          y: 198,
        },
        b: {
          x: 1321,
          y: 248,
        },
      },
      {
        a: {
          x: 1321,
          y: 248,
        },
        b: {
          x: 1271,
          y: 248,
        },
      },
      {
        a: {
          x: 1271,
          y: 248,
        },
        b: {
          x: 1271,
          y: 198,
        },
      },
      {
        a: {
          x: 1581.3816118212867,
          y: 202.3875279308736,
        },
        b: {
          x: 1580.6124720691264,
          y: 252.38161182128658,
        },
      },
      {
        a: {
          x: 1580.6124720691264,
          y: 252.38161182128658,
        },
        b: {
          x: 1270.6183881787133,
          y: 247.6124720691264,
        },
      },
      {
        a: {
          x: 1270.6183881787133,
          y: 247.6124720691264,
        },
        b: {
          x: 1271.3875279308736,
          y: 197.61838817871342,
        },
      },
      {
        a: {
          x: 1271.3875279308736,
          y: 197.61838817871342,
        },
        b: {
          x: 1581.3816118212867,
          y: 202.3875279308736,
        },
      },
      {
        a: {
          x: 1581,
          y: 313,
        },
        b: {
          x: 1531,
          y: 313,
        },
      },
      {
        a: {
          x: 1531,
          y: 313,
        },
        b: {
          x: 1531,
          y: 202,
        },
      },
      {
        a: {
          x: 1531,
          y: 202,
        },
        b: {
          x: 1581,
          y: 202,
        },
      },
      {
        a: {
          x: 1581,
          y: 202,
        },
        b: {
          x: 1581,
          y: 313,
        },
      },
    ],
  },
];

const RenderCanvas = (props: BoardProps) => {
  const { width, height, lightIntensity, mouseSensitivity } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLCanvasElement | null>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundRef = useRef<HTMLCanvasElement | null>(null);
  const lightRef = useRef<HTMLCanvasElement | null>(null);

  const [pos, setPos] = useState<Character>({
    x: 50,
    y: 50,
    radius: 20,
    angle: 0,
    speed: 3,
  });

  const [keys, setKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const [userAttributes, setUserAttributes] = useState({
    visibleRadius: 300,
    visibleAngle: Math.PI / 3,
    attackRadius: 200,
    attackAngle: Math.PI / 3,
  });

  useBaseKeyPress(setKeys);

  useEffect(() => {
    const initializeCanvasSize = () => {
      const container = containerRef.current;
      const renderCanvas = renderRef.current;
      const lightCanvas = lightRef.current;
      const buffCanvas = buffRef.current;
      const backgroundCanvas = backgroundRef.current;
      if (
        !container ||
        !renderCanvas ||
        !backgroundCanvas ||
        !lightCanvas ||
        !buffCanvas
      )
        return;
      const backgroundCtx = backgroundCanvas.getContext("2d");
      const buffCtx = buffCanvas.getContext("2d");

      if (!backgroundCtx || !buffCtx) return;

      renderCanvas.width = container.clientWidth;
      renderCanvas.height = container.clientHeight;

      const img = new Image();
      img.src = "/images/map01.png";
      img.onload = () => {
        backgroundCtx.drawImage(img, 0, 0);
        backgroundCtx.strokeStyle = "#fff";
        // GeometryList.forEach((seg) => {
        //   seg.segments.forEach((segment) => {
        //     backgroundCtx.beginPath();
        //     backgroundCtx.moveTo(segment.a.x, segment.a.y);
        //     backgroundCtx.lineTo(segment.b.x, segment.b.y);
        //     backgroundCtx.stroke();
        //   });
        // });
        buffCtx.drawImage(backgroundCanvas, 0, 0);
      };
    };
    initializeCanvasSize();
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      let startX = event.clientX;
      let initialAngle = pos.angle;

      const handleMouseMove = (event: MouseEvent) => {
        const deltaX = ((event.clientX - startX) / 10) * mouseSensitivity;
        setPos((prevPos) => ({
          ...prevPos,
          angle: initialAngle - deltaX,
        }));
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [pos.angle]);

  useEffect(() => {
    const radian = (angle: number) => (angle * Math.PI) / 180;

    const moveCharacter = () => {
      setPos((prevPos) => {
        const { x, y, angle, speed } = prevPos;
        let moveX = 0;
        let moveY = 0;

        const rad = radian(angle);

        if (keys.up) {
          moveX -= Math.sin(rad);
          moveY -= Math.cos(rad);
        }
        if (keys.down) {
          moveX += Math.sin(rad);
          moveY += Math.cos(rad);
        }
        if (keys.left) {
          moveX -= Math.cos(rad);
          moveY += Math.sin(rad);
        }
        if (keys.right) {
          moveX += Math.cos(rad);
          moveY -= Math.sin(rad);
        }

        const length = Math.sqrt(moveX * moveX + moveY * moveY);
        if (length > 0) {
          moveX = (moveX / length) * speed;
          moveY = (moveY / length) * speed;
        }

        let newPos = {
          ...prevPos,
          x: x + moveX,
          y: y + moveY,
        };

        const {
          collided,
          x: newX,
          y: newY,
        } = handleCollision(GeometryList, pos.radius, newPos.x, newPos.y);
        if (collided) {
          newPos.x = newX;
          newPos.y = newY;
        }

        return newPos;
      });
    };

    const intervalId = setInterval(moveCharacter, 16);
    return () => clearInterval(intervalId);
  }, [keys]);

  const render = useCallback(() => {
    const renderCanvas = renderRef.current;
    const buffCanvas = buffRef.current;
    const lightCanvas = lightRef.current;
    if (!renderCanvas || !buffCanvas || !lightCanvas) return;

    const renderCtx = renderCanvas.getContext("2d");
    const lightCtx = lightCanvas.getContext("2d");
    if (!renderCtx || !lightCtx) return;

    renderCtx.clearRect(0, 0, renderCanvas.width, renderCanvas.height);

    const centerX = renderCanvas.width / 2;
    const centerY = renderCanvas.height - 100;

    drawBuff();
    // 渲染缓冲
    renderCtx.save();
    renderCtx.translate(centerX, centerY);
    renderCtx.rotate((pos.angle * Math.PI) / 180);
    renderCtx.drawImage(buffCanvas, -pos.x, -pos.y);
    renderCtx.restore();

    drawCircle(
      renderCtx,
      centerX,
      centerY,
      pos.radius,
      "rgba(255, 255, 255, 0.5)"
    );
  }, [pos]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos.angle, pos.radius, pos.x, pos.y, render]);

  // 绘制缓冲区
  const drawBuff = () => {
    const lightCanvas = lightRef.current;
    const buffCanvas = buffRef.current;
    const backgroundCanvas = backgroundRef.current;
    if (!lightCanvas || !buffCanvas || !backgroundCanvas) return;

    const lightCtx = lightCanvas.getContext("2d");
    const buffCtx = buffCanvas.getContext("2d");
    if (!lightCtx || !buffCtx) return;

    lightCtx.clearRect(0, 0, lightCanvas.width, lightCanvas.height);

    // 绘制遮罩
    lightCtx.fillStyle = "rgba(0, 0, 0, 0.8)";
    lightCtx.fillRect(0, 0, lightCanvas.width, lightCanvas.height);

    // 绘制角色视线
    drawCharacterViewpoints(
      lightCtx,
      GeometryList,
      pos.x,
      pos.y,
      userAttributes.visibleRadius,
      userAttributes.visibleAngle,
      userAttributes.attackRadius,
      userAttributes.attackAngle,
      // -Math.PI / 2,
      -(pos.angle * Math.PI) / 180 - Math.PI / 2
    );
    // 绘制缓冲图层
    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);
    // 绘制背景图层
    buffCtx.drawImage(backgroundCanvas, 0, 0);

    // 绘制灯光图层
    buffCtx.drawImage(lightCanvas, 0, 0);
  };

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={renderRef} />
      <canvas
        style={{ display: "none" }}
        width={width}
        height={height}
        ref={lightRef}
      />
      <canvas
        style={{ display: "none" }}
        ref={buffRef}
        width={width}
        height={height}
      />
      <canvas
        style={{ display: "none" }}
        ref={backgroundRef}
        width={width}
        height={height}
      />

      {/* <div
        className={styles["canvas-info"]}
      >{`x: ${pos.x}, y: ${pos.y}, angle: ${pos.angle}`}</div> */}
    </div>
  );
};

export default RenderCanvas;

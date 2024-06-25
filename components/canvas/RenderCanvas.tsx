"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/canvas/canvas.module.css";
import {
  BoardProps,
  Bullet,
  Character,
  Enemy,
  Geometry,
  Weapon,
} from "@/types/CanvasTypes";
import { drawCharacterViewpoints } from "./helpers/LightDraw";
import { useBaseKeyPress } from "../hook/useKeyPress";
import { handleCollision } from "@/components/canvas/helpers/PhysicsDraw";
import {
  GeometryList,
  drawCircle,
  drawDashedRing,
  playBackgroundMusic,
} from "./helpers/BaseDraw";
import {
  createBullet,
  fireWeapon,
  reloadWeapon,
  weaponDatabase,
} from "./helpers/FightingDraw";
import { Button } from "@nextui-org/button";
import { TbMusic, TbMusicX } from "react-icons/tb";
import { createEnemy, enemyDatabase } from "./helpers/EnemyDraw";

const RenderCanvas = (props: BoardProps) => {
  const { width, height, lightIntensity, mouseSensitivity } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<HTMLCanvasElement | null>(null);
  const buffRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundRef = useRef<HTMLCanvasElement | null>(null);
  const lightRef = useRef<HTMLCanvasElement | null>(null);
  const bulletRef = useRef<HTMLCanvasElement | null>(null);

  // 预加载图像
  const [buffImages, setBuffImages] = useState<{
    [key: string]: HTMLImageElement;
  }>({});

  // 预加载音效
  const [buffSounds, setBuffSounds] = useState<{
    [key: string]: HTMLAudioElement;
  }>({});

  // 预加背景音乐
  const [bgmSound, setBgmSound] = useState<HTMLAudioElement | null>(null);
  const [bgmPlaying, setBgmPlaying] = useState<boolean>(false);

  const [pos, setPos] = useState<Character>({
    x: 50,
    y: 50,
    radius: 20,
    angle: 0,
    speed: 3,
  });

  const [weapon, setWeapon] = useState<Weapon>();
  const [bulletList, setBulletList] = useState<Bullet[]>([]);
  const [enemyList, setEnemyList] = useState<Enemy[]>([]);

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
    // 预加载图像
    const preloadAssets = () => {
      for (const weaponCode in weaponDatabase) {
        const weapon = weaponDatabase[weaponCode];
        const image = new Image();
        image.src = weapon.imageSrc;
        image.onload = () => {
          setBuffImages((prevImages) => ({
            ...prevImages,
            [weaponCode]: image,
          }));
        };

        const audio = new Audio();
        audio.src = weapon.soundSrc;
        setBuffSounds((prevSounds) => ({
          ...prevSounds,
          [weaponCode]: audio,
        }));
      }

      for (const enemyCode in enemyDatabase) {
        const enemy = enemyDatabase[enemyCode];
        const image = new Image();
        image.src = enemy.imageSrc;
        image.onload = () => {
          setBuffImages((prevImages) => ({
            ...prevImages,
            [enemyCode]: image,
          }));
        };
      }
    };

    const initializeCanvasSize = () => {
      const container = containerRef.current;
      const renderCanvas = renderRef.current;
      const buffCanvas = buffRef.current;
      const backgroundCanvas = backgroundRef.current;
      if (!container || !renderCanvas || !backgroundCanvas || !buffCanvas)
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
        buffCtx.drawImage(backgroundCanvas, 0, 0);
      };
    };
    preloadAssets();
    setBgmSound(new Audio("sounds/bgm/loopBgm01.wav"));

    setEnemyList((prevList) => [...prevList, createEnemy("gyonshi", 500, 200)]);

    setWeapon(weaponDatabase.rifle);
    initializeCanvasSize();
  }, []);

  useEffect(() => {
    if (!bgmSound) return;
    bgmSound.play();
    bgmSound.loop = true;
    if (!bgmPlaying) {
      bgmSound?.pause();
    }
  }, [bgmSound, bgmPlaying]);

  // 改变角度
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
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
  }, [pos.angle, pos.x, pos.y]);

  // 移动
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

  // 渲染
  const render = useCallback(() => {
    const renderCanvas = renderRef.current;
    const buffCanvas = buffRef.current;
    if (!renderCanvas || !buffCanvas) return;

    const renderCtx = renderCanvas.getContext("2d");
    if (!renderCtx) return;

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

    if (weapon) {
      const bullet = fireWeapon(
        weapon,
        pos.x,
        pos.y,
        -(pos.angle * Math.PI) / 180 - Math.PI / 2,
        buffSounds["rifle"]
      );

      if (bullet) {
        setBulletList((prevBulletList) => [...prevBulletList, bullet]);
      }
      if (
        weapon.weaponState.currentAmmo === 0 &&
        !weapon.weaponState.isReloading
      ) {
        reloadWeapon(weapon, renderCtx);
      }
    }
  }, [pos]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [render]);

  // 绘制缓冲区
  const drawBuff = () => {
    const buffCanvas = buffRef.current;
    const backgroundCanvas = backgroundRef.current;
    if (!buffCanvas || !backgroundCanvas) return;
    const buffCtx = buffCanvas.getContext("2d");
    if (!buffCtx) return;
    // 绘制缓冲图层
    buffCtx.clearRect(0, 0, buffCanvas.width, buffCanvas.height);
    // 绘制背景图层
    buffCtx.drawImage(backgroundCanvas, 0, 0);

    drawLight(buffCtx);

    // 绘制敌人
    if (enemyList.length > 0) {
      enemyList.forEach((enemy) => {
        const image = buffImages[enemy.code];

        if (!image) return;
        if (enemy.active) {
          enemy.update(pos.x, pos.y);

          const dashLength = 10; // 虚线长度
          const gapLength = 5; // 间隙长度
          const color = "rgba(255, 10, 10, 0.5)"; // 颜色

          drawDashedRing(
            buffCtx,
            enemy.x,
            enemy.y,
            enemy.radius + 10,
            dashLength,
            gapLength,
            color,
            pos.angle
          );

          buffCtx.save();
          buffCtx.translate(enemy.x, enemy.y);
          buffCtx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2,
            image.width,
            image.height
          );
          buffCtx.restore();
        }
      });

      setEnemyList(
        enemyList.filter((enemy) => {
          if (enemy.active) {
            return true;
          } else {
            return false;
          }
        })
      );
    }

    drawBullet(buffCtx);
  };

  // 绘制灯光
  const drawLight = (buffCtx: CanvasRenderingContext2D) => {
    const lightCanvas = lightRef.current;
    if (!lightCanvas) return;
    const lightCtx = lightCanvas.getContext("2d");
    if (!lightCtx) return;
    // 绘制遮罩
    lightCtx.fillStyle = "rgba(0, 0, 0, 0.9)";
    lightCtx.clearRect(0, 0, lightCanvas.width, lightCanvas.height);
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
    buffCtx.drawImage(lightCanvas, 0, 0);
  };
  const drawBullet = (buffCtx: CanvasRenderingContext2D) => {
    const bulletCanvas = bulletRef.current;
    if (!bulletCanvas) return;
    const bulletCtx = bulletCanvas.getContext("2d");
    if (!bulletCtx) return;
    // 绘制遮罩
    bulletCtx.clearRect(0, 0, bulletCanvas.width, bulletCanvas.height);
    // 绘制子弹
    if (bulletList.length > 0) {
      bulletList.forEach((bullet) => {
        const image = buffImages[bullet.code];

        if (!image) return;
        if (bullet.active) {
          bullet.update(GeometryList, enemyList);
          bullet.draw(bulletCtx, image);
        }
      });

      setBulletList(
        bulletList.filter((bullet) => {
          if (bullet.active) {
            return true;
          } else {
            return false;
          }
        })
      );
    }
    buffCtx.drawImage(bulletCanvas, 0, 0);
  };

  return (
    <div className={styles["canvas-container"]} ref={containerRef}>
      <canvas ref={renderRef} />
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
      <canvas
        style={{ display: "none" }}
        ref={lightRef}
        width={width}
        height={height}
      />
      <canvas
        style={{ display: "none" }}
        ref={bulletRef}
        width={width}
        height={height}
      />

      <div className={styles["canvas-info"]}>
        <Button isIconOnly onClick={() => setBgmPlaying(!bgmPlaying)}>
          {bgmPlaying ? <TbMusic /> : <TbMusicX />}
        </Button>
      </div>
    </div>
  );
};

export default RenderCanvas;

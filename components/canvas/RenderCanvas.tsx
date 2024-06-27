"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "@/styles/canvas/canvas.module.css";
import {
  BoardProps,
  Bullet,
  Character,
  Enemy,
  Weapon,
} from "@/types/CanvasTypes";
import { drawCharacterViewpoints } from "./helpers/LightDraw";
import { useBaseKeyPress } from "../hook/useKeyPress";
import { handleCollision } from "@/components/canvas/helpers/PhysicsDraw";
import {
  GeometryList,
  drawDashedRing,
  drawHealthBar,
  drawPlayer,
} from "./helpers/BaseDraw";
import {
  drawReloadAnimation,
  fireWeapon,
  reloadWeapon,
  weaponDatabase,
} from "./helpers/FightingDraw";
import { Button } from "@nextui-org/button";
import {
  TbActivityHeartbeat,
  TbMusic,
  TbMusicX,
  TbShieldHeart,
} from "react-icons/tb";
import {
  createEnemy,
  enemyDatabase,
  isEnemyInSector,
} from "./helpers/EnemyDraw";
import { Image as NextImage, Slider } from "@nextui-org/react";
import { useLegMovement } from "../hook/canvas/useLegMovement";

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

  const [player, setPlayer] = useState<Character>({
    x: 750,
    y: 150,
    radius: 20,
    angle: 180,
    speed: 2,
    health: 100,
    shield: 0,
    maxHealth: 100,
    maxShield: 100,
  });

  const [weapon, setWeapon] = useState<Weapon>();
  const [bulletList, setBulletList] = useState<Bullet[]>([]);
  const [enemyList, setEnemyList] = useState<Enemy[]>([]); // 敌人
  const [attackableEnemies, setAttackableEnemies] = useState<Enemy[]>([]); // 可攻击的敌人

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
    attackAngle: Math.PI / 6,
  });

  useBaseKeyPress(setKeys);
  const { legOffsetX, legOffsetY } = useLegMovement(keys, player);

  useEffect(() => {
    // 预加载图像
    const preloadAssets = () => {
      const loadSounds = (code: string, src: string) => {
        const audio = new Audio(src);
        setBuffSounds((prevSounds) => ({
          ...prevSounds,
          [code]: audio,
        }));
      };

      const loadImages = (code: string, src: string) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
          setBuffImages((prevImages) => ({
            ...prevImages,
            [code]: image,
          }));
        };
      };
      // 预加载音效
      loadSounds("weaponLoaded", "/sounds/weapon/loaded.wav");
      loadSounds("weaponLoading", "/sounds/weapon/loading.wav");
      loadImages("ManBlue", "/images/ManBlue/manBlue_gun.png");
      for (const weaponCode in weaponDatabase) {
        const weapon = weaponDatabase[weaponCode];
        loadImages(weaponCode, weapon.imageSrc);
        loadSounds(weaponCode, weapon.soundSrc);
      }
      for (const enemyCode in enemyDatabase) {
        const enemy = enemyDatabase[enemyCode];
        loadImages(enemyCode, enemy.imageSrc);
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

    setEnemyList((prevList) => [
      ...prevList,
      createEnemy("gyonshi", 1000, 700),
    ]);

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

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      let startX = event.clientX;
      let initialAngle = player.angle;

      const handleMouseMove = (event: MouseEvent) => {
        const deltaX = ((event.clientX - startX) / 10) * mouseSensitivity;
        setPlayer((prevPos) => ({
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

    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      let startX = event.touches[0].clientX;
      let initialAngle = player.angle;

      const handleTouchMove = (event: TouchEvent) => {
        const deltaX =
          ((event.touches[0].clientX - startX) / 10) * mouseSensitivity;
        setPlayer((prevPos) => ({
          ...prevPos,
          angle: initialAngle - deltaX,
        }));
      };

      const handleTouchEnd = () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };

      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [player.angle, player.x, player.y]);

  // 移动
  useEffect(() => {
    const radian = (angle: number) => (angle * Math.PI) / 180;

    const moveCharacter = () => {
      setPlayer((prevPos) => {
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
        } = handleCollision(GeometryList, player.radius, newPos.x, newPos.y);
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
    renderCtx.rotate((player.angle * Math.PI) / 180);
    renderCtx.drawImage(buffCanvas, -player.x, -player.y);
    renderCtx.restore();

    const image = buffImages["ManBlue"];
    if (image) {
      drawPlayer(
        renderCtx,
        centerX,
        centerY,
        player,
        image,
        legOffsetX,
        legOffsetY
      );
    }
    drawWeapon(renderCtx, centerX, centerY);
  }, [player]);

  const drawWeapon = (
    renderCtx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    if (!weapon) return;

    const weaponState = weapon.weaponState;

    const playSound = (sound: HTMLAudioElement) => {
      if (sound) {
        sound.currentTime = 0;
        sound.play();
      }
    };
    if (weaponState.currentAmmo > 0 && attackableEnemies.length > 0) {
      const bullet = fireWeapon(
        weapon,
        player.x,
        player.y,
        -(player.angle * Math.PI) / 180 - Math.PI / 2,
        buffSounds["rifle"]
      );

      if (bullet) {
        setBulletList((prevBulletList) => [...prevBulletList, bullet]);
      }
    }

    if (
      weaponState.currentAmmo == 0 &&
      weaponState.currentBulletCount > 0 &&
      !weaponState.isReloading
    ) {
      // 装弹
      reloadWeapon(weapon, buffSounds["weaponLoading"]);
    }

    if (weaponState.isReloading) {
      // 装弹动画
      const elapsed = performance.now() - weaponState.lastReloadime;

      if (elapsed >= weapon.reloadTime - 500 && !weaponState.soundPlayed) {
        // 提前一秒播放装弹完成的声音
        buffSounds["weaponLoading"].pause();
        playSound(buffSounds["weaponLoaded"]);
        weaponState.soundPlayed = true;
      }

      if (elapsed >= weapon.reloadTime) {
        // 装弹完成
        weaponState.isReloading = false;
        const currentAmmo = Math.min(
          weapon.magazineSize,
          weaponState.currentBulletCount
        );
        weaponState.currentAmmo = currentAmmo;
        weaponState.currentBulletCount -= currentAmmo;
        weaponState.soundPlayed = false; // 重置声音播放标记
      } else {
        const progress = elapsed / weapon.reloadTime;
        drawReloadAnimation(renderCtx, x, y, progress);
      }
    }
  };

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

    // 绘制灯光
    drawLight(buffCtx);
    // 绘制子弹
    drawBullet(buffCtx);
    // 绘制敌人
    drawEnemy(buffCtx);
  };

  const drawEnemy = (buffCtx: CanvasRenderingContext2D) => {
    // 绘制敌人
    if (enemyList.length > 0) {
      const showEnemy = enemyList.filter((enemy) =>
        isEnemyInSector(
          enemy,
          player.x,
          player.y,
          userAttributes.visibleRadius,
          userAttributes.visibleAngle,
          -(player.angle * Math.PI) / 180 - Math.PI / 2
        )
      );

      showEnemy.forEach((enemy) => {
        const image = buffImages[enemy.code];

        if (!image) return;
        enemy.update(player.x, player.y);

        const dashLength = 10; // 虚线长度
        const color = "rgba(210, 210, 210, 0.5)"; // 颜色

        // 绘制虚线
        drawDashedRing(
          buffCtx,
          enemy.x,
          enemy.y,
          enemy.radius,
          dashLength,
          color,
          player.angle
        );
        // 绘制血条
        drawHealthBar(
          buffCtx,
          enemy.x,
          enemy.y,
          enemy.health / enemy.maxHealth,
          enemy.radius,
          -player.angle
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
      });

      setAttackableEnemies(
        showEnemy.filter((enemy) =>
          isEnemyInSector(
            enemy,
            player.x,
            player.y,
            userAttributes.attackRadius,
            userAttributes.attackAngle,
            -(player.angle * Math.PI) / 180 - Math.PI / 2
          )
        )
      );
    }
  };

  // 绘制灯光
  const drawLight = (buffCtx: CanvasRenderingContext2D) => {
    const lightCanvas = lightRef.current;
    if (!lightCanvas) return;
    const lightCtx = lightCanvas.getContext("2d");
    if (!lightCtx) return;
    // 绘制遮罩
    lightCtx.fillStyle = "rgba(0, 0, 0, 0.97)";
    lightCtx.clearRect(0, 0, lightCanvas.width, lightCanvas.height);
    lightCtx.fillRect(0, 0, lightCanvas.width, lightCanvas.height);
    // 绘制角色视线
    drawCharacterViewpoints(
      lightCtx,
      GeometryList,
      player.x,
      player.y,
      userAttributes.visibleRadius,
      userAttributes.visibleAngle,
      userAttributes.attackRadius,
      userAttributes.attackAngle,
      // -Math.PI / 2,
      -(player.angle * Math.PI) / 180 - Math.PI / 2
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

      <div className={styles["info-left"]}>
        <div>
          <div className="flex align-items-center w-[200px] justify-between">
            <div className="flex align-items-center">
              <TbActivityHeartbeat size={24} className="mr-1" />
              {"血量:" + player.health + " "}
            </div>
            <div className="flex align-items-center">
              <TbShieldHeart size={18} className="mr-1" />
              {"护盾:" + player.shield}
            </div>
          </div>
          <Slider
            aria-label="Player health"
            color="danger"
            isDisabled
            step={1}
            maxValue={player.maxHealth}
            minValue={0}
            hideThumb={true}
            defaultValue={player.health}
            className="max-w-md"
          />
          <Slider
            aria-label="Player shield"
            classNames={{
              filler: "bg-[#fff]",
            }}
            isDisabled
            step={1}
            maxValue={player.maxShield}
            minValue={0}
            hideThumb={true}
            defaultValue={player.shield}
            className="max-w-md"
          />
        </div>
        <Button
          isIconOnly
          onClick={() => setBgmPlaying(!bgmPlaying)}
          variant="light"
          className="text-[#6B7280] hover:bg-[#f0f0f0] mt-1"
        >
          {bgmPlaying ? <TbMusic size={20} /> : <TbMusicX size={20} />}
        </Button>
      </div>
      <div className={styles["info-right"]}>
        <NextImage src={"/images/weapon/weapon01.png"} width={150} />
        <div className="flex align-items-center">
          <NextImage
            radius="none"
            src={"/images/weapon/bullet.png"}
            width={18}
          />
          <div className="text-right flex align-items-center ml-2 ">
            <span className="ml-1 font-bold text-[#6B7280] text-[20px]">
              {weapon && weapon?.weaponState.currentAmmo + " / "}
              <span className="text-[#ae5b36] text-[16px]">
                {weapon?.weaponState.currentBulletCount}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderCanvas;

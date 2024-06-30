"use client";

import { Button } from "@nextui-org/button";
import React, { useState, useEffect } from "react";
import {
  TbAlarm,
  TbBell,
  TbCoin,
  TbHeart,
  TbMoodSad,
  TbPennant,
  TbPlayerStop,
  TbPlayerStopFilled,
} from "react-icons/tb";

// Grid 组件的属性类型定义
interface GridProps {
  mainColor: string; // 主颜色
  differentColor: string; // 异常颜色
  differentColorCoords: { row: number; col: number }; // 异常颜色的坐标
  gridSize: number; // 网格大小
  onSquareClick: (row: number, col: number) => void; // 方格点击事件处理函数
  highlightTarget: boolean; // 是否抖动目标方块
  incorrectClicks: { row: number; col: number }[]; // 错误点击记录
}

// Grid 组件定义
const Grid: React.FC<GridProps> = ({
  mainColor,
  differentColor,
  differentColorCoords,
  gridSize,
  onSquareClick,
  highlightTarget,
  incorrectClicks,
}) => {
  const rows = new Array(gridSize).fill(0); // 创建行数组
  const cols = new Array(gridSize).fill(0); // 创建列数组

  // 根据行和列的索引返回方格的颜色
  const getColor = (row: number, col: number) => {
    if (row === differentColorCoords.row && col === differentColorCoords.col) {
      return differentColor; // 返回异常颜色
    }
    const isIncorrectClick = incorrectClicks.some(
      (click) => click.row === row && click.col === col
    );
    if (isIncorrectClick) {
      return "transparent"; // 返回背景色
    }
    return mainColor; // 返回主颜色
  };

  // 网格样式
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    gap: "3px",
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    overflow: "hidden",
  };

  return (
    <div style={gridStyle}>
      {rows.map((_, rowIndex) =>
        cols.map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onSquareClick(rowIndex, colIndex)} // 绑定点击事件
            style={{
              backgroundColor: getColor(rowIndex, colIndex),
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
              borderRadius: "5px",
              animation:
                highlightTarget &&
                rowIndex === differentColorCoords.row &&
                colIndex === differentColorCoords.col
                  ? "shake 0.5s infinite"
                  : "none",
            }}
          />
        ))
      )}
    </div>
  );
};

// 随机生成颜色
const getRandomColor = (baseColor: string, variance: number) => {
  const [r, g, b, a] = baseColor.match(/\d+/g)!.map(Number);
  const randomVariance = () =>
    Math.floor(Math.random() * variance * 2) - variance;
  return `rgba(${r + randomVariance()}, ${g + randomVariance()}, ${
    b + randomVariance()
  }, ${a})`;
};

// 随机生成基础颜色
const getRandomBaseColor = () => {
  const randomValue = () => Math.floor(Math.random() * 256);
  return `rgba(${randomValue()}, ${randomValue()}, ${randomValue()}, 1)`;
};

// 历史排行榜数据类型定义
interface ScoreRecord {
  score: number;
  level: number;
  time: number;
}

// 从本地存储中获取历史排行榜数据
const getStoredScores = (): ScoreRecord[] => {
  const scores = localStorage.getItem("scores");
  return scores ? JSON.parse(scores) : [];
};

// 将当前得分保存到本地存储
const storeScore = (newScore: ScoreRecord) => {
  const scores = getStoredScores();
  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score); // 按分数从高到低排序
  localStorage.setItem("scores", JSON.stringify(scores.slice(0, 10))); // 保留前10名
};

// 主页面组件定义
const CommunityPage: React.FC = () => {
  const [gameState, setGameState] = useState<"start" | "playing" | "end">(
    "start"
  ); // 游戏状态
  const [score, setScore] = useState(0); // 分数状态
  const [gridSize, setGridSize] = useState(3); // 初始网格大小
  const [differentColorCoords, setDifferentColorCoords] = useState({
    row: 1,
    col: 1,
  }); // 异常颜色的初始坐标
  const [mainColor, setMainColor] = useState(getRandomBaseColor()); // 初始主颜色
  const [differentColor, setDifferentColor] = useState(
    getRandomColor(mainColor, 50)
  ); // 初始异常颜色
  const [variance, setVariance] = useState(50); // 颜色差异
  const [clicksLeft, setClicksLeft] = useState(3); // 每关剩余的点击次数
  const [highlightTarget, setHighlightTarget] = useState(false); // 是否抖动目标方块
  const [gridSizePx, setGridSizePx] = useState<number>(); // 网格大小（像素）
  const [incorrectClicks, setIncorrectClicks] = useState<
    { row: number; col: number }[]
  >([]); // 错误点击记录
  const [level, setLevel] = useState(1); // 当前关卡
  const [startTime, setStartTime] = useState<number>(Date.now()); // 关卡开始时间
  const [totalMistakes, setTotalMistakes] = useState(0); // 总失败次数
  const [scoreAnimation, setScoreAnimation] = useState<string | null>(null); // 得分动画
  const [levelTimeLimit, setLevelTimeLimit] = useState(10); // 每关时间限制
  const [elapsedTime, setElapsedTime] = useState(0); // 关卡消耗时间

  useEffect(() => {
    generateNewLevel();
  }, [gridSize, variance]);

  useEffect(() => {
    const updateGridSize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (windowHeight > windowWidth) {
        // 手机端，网格和辅助清单上下结构
        const newSize = Math.min(windowWidth, windowHeight);
        setGridSizePx(newSize);
      } else {
        // 电脑端，网格和辅助清单左右结构
        const newSize = Math.min(windowHeight, windowWidth);
        setGridSizePx(newSize);
      }
    };

    window.addEventListener("resize", updateGridSize);
    updateGridSize(); // 初始调用

    return () => {
      window.removeEventListener("resize", updateGridSize);
    };
  }, []);

  useEffect(() => {
    if (gameState === "playing") {
      const interval = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000); // 计算实时消耗时间
      }, 100);

      return () => clearInterval(interval); // 清除定时器
    }
  }, [startTime, gameState]);

  const handleUseTool = () => {
    setHighlightTarget(true); // 使用道具高亮目标方块
  };

  const generateNewLevel = () => {
    const newDifferentColorCoords = {
      row: Math.floor(Math.random() * gridSize),
      col: Math.floor(Math.random() * gridSize),
    };
    setDifferentColorCoords(newDifferentColorCoords);
    const newMainColor = getRandomBaseColor();
    setMainColor(newMainColor);
    setDifferentColor(getRandomColor(newMainColor, variance));
    setClicksLeft(3); // 重置点击次数
    setHighlightTarget(false); // 重置高亮
    setIncorrectClicks([]); // 清除错误点击记录
    setStartTime(Date.now()); // 记录新关卡的开始时间
    setLevelTimeLimit(10 + Math.floor(level / 3)); // 每三关增加1秒时间限制
  };

  const handleSquareClick = (row: number, col: number) => {
    if (clicksLeft > 0) {
      const isIncorrectClick = incorrectClicks.some(
        (click) => click.row === row && click.col === col
      );
      if (!isIncorrectClick) {
        if (
          row === differentColorCoords.row &&
          col === differentColorCoords.col
        ) {
          const endTime = Date.now();
          const timeTaken = (endTime - startTime) / 1000; // 计算用时（秒）
          let points = 1; // 最低1分

          const levelTimeLimit30 = levelTimeLimit * 0.3;
          const levelTimeLimit50 = levelTimeLimit * 0.5;
          const levelTimeLimit70 = levelTimeLimit * 0.7;

          if (timeTaken <= levelTimeLimit30) points = 5;
          else if (timeTaken <= levelTimeLimit50) points = 3;
          else if (timeTaken <= levelTimeLimit70) points = 2;

          setScore(score + points);
          setScoreAnimation(`+${points} 分`);

          setTimeout(() => setScoreAnimation(null), 1000); // 动画显示1秒钟

          console.log(variance);

          // 根据关卡增加难度
          if ((level + 1) % 5 === 0) {
            setGridSize(3); // 增加网格大小
            setVariance(Math.max(variance - 10, 20)); // 减少颜色差异
          } else {
            setGridSize(Math.min(gridSize + 1, 10)); // 增加网格大小
            setVariance(Math.max(variance - 1, 20)); // 减少颜色差异
          }

          setLevel(level + 1); // 增加关卡
          generateNewLevel(); // 点击正确后生成新关卡
        } else {
          setClicksLeft(clicksLeft - 1); // 错误点击消耗一次点击次数
          setIncorrectClicks([...incorrectClicks, { row, col }]); // 标记错误点击
          setTotalMistakes(totalMistakes + 1); // 增加总失败次数
          if (clicksLeft - 1 === 0) {
            // 游戏结束，显示结束界面
            gameEnd();
          }
        }
      }
    }
  };
  const gameEnd = () => {
    setGameState("end");
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // 计算用时（秒）
    storeScore({ score, level, time: elapsedTime }); // 保存当前得分
  };
  const handleStartGame = () => {
    setGameState("playing");
    setScore(0);
    setGridSize(3);
    setVariance(50);
    setLevel(1);
    setTotalMistakes(0);
    setElapsedTime(0);
    generateNewLevel();
  };

  const renderStartScreen = () => (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4">
      <h1 className="text-4xl mb-4">找不同颜色方块游戏</h1>
      <div className="text-center mb-4">
        <h2 className="text-2xl mb-2">历史排行榜</h2>
        <ol>
          {getStoredScores().map((record, index) => (
            <li key={index}>
              第{index + 1}名 - 分数: {record.score} - 关卡: {record.level} -
              时间: {record.time.toFixed(1)}秒
            </li>
          ))}
        </ol>
      </div>
      <Button onClick={handleStartGame} className="text-2xl">
        开始游戏
      </Button>
    </div>
  );

  const renderEndScreen = () => (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4">
      <h1 className="text-4xl mb-4">游戏结束</h1>
      <div className="text-center mb-4">
        <h2 className="text-2xl mb-2">本局得分</h2>
        <p>
          分数: {score} - 关卡: {level} - 时间: {elapsedTime.toFixed(1)}秒
        </p>
      </div>
      <div className="text-center mb-4">
        <h2 className="text-2xl mb-2">历史排行榜</h2>
        <ol>
          {getStoredScores().map((record, index) => (
            <li key={index}>
              第{index + 1}名 - 分数: {record.score} - 关卡: {record.level} -
              时间: {record.time.toFixed(1)}秒
            </li>
          ))}
        </ol>
      </div>
      <Button onClick={handleStartGame} className="text-2xl">
        再来一局
      </Button>
    </div>
  );

  const renderGameScreen = () => (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4">
      <div
        className="px-4 rounded-lg text-center flex items-center justify-between"
        style={{
          width: `${gridSizePx}px`,
          borderRadius: "10px",
        }}
      >
        <div className="text-lg flex items-center justify-center">
          <TbPennant size={20} className="mr-1" />
          <span>Level: {level}</span>
        </div>

        <div className="text-lg flex items-center justify-cente ml-6">
          <TbAlarm size={20} className="mr-1" />
          <span className="flex">
            <div className="text-[#FF8D02] min-w-[40px]">
              {elapsedTime.toFixed(1)}
            </div>
            s
          </span>
        </div>

        <div className="text-lg flex items-center justify-cente ml-6">
          <TbCoin size={20} className="mr-1" />
          <span>积分: {score}</span>
        </div>
      </div>

      {/* 网格容器 */}
      <div
        className="relative"
        style={{
          width: `${gridSizePx}px`,
          height: `${gridSizePx}px`,
        }}
      >
        <div className="absolute inset-0 p-4">
          <Grid
            mainColor={mainColor}
            differentColor={differentColor}
            differentColorCoords={differentColorCoords}
            gridSize={gridSize}
            onSquareClick={handleSquareClick}
            highlightTarget={highlightTarget}
            incorrectClicks={incorrectClicks}
          />
        </div>
        {scoreAnimation && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-3xl font-bold text-green-500 animate-bounce">
            {scoreAnimation}
          </div>
        )}
      </div>

      {/* 辅助清单 */}
      <div
        className="px-4 text-center flex items-center justify-between "
        style={{
          width: `${gridSizePx}px`,
          borderRadius: "10px",
        }}
      >
        <div className="text-sm flex items-center justify-center">
          <div className=" flex items-center justify-center">
            <TbHeart size={20} className="mr-1" />
            <span>回合步数: {clicksLeft}</span>
          </div>
          <div className=" flex items-center justify-cente ml-6">
            <TbMoodSad size={20} className="mr-1" />
            <span>失误次数: {totalMistakes}</span>
          </div>
        </div>
        <div className="text-lg flex items-center justify-cente">
          <Button
            onClick={handleUseTool}
            isIconOnly
            variant="light"
            startContent={<TbBell size={20} />}
            isDisabled={highlightTarget} // 已经使用过道具时禁用按钮
          />
          <Button
            onClick={gameEnd}
            isIconOnly
            startContent={<TbPlayerStopFilled color="red" size={20} />}
            isDisabled={gameState !== "playing"} // 已经使用过道具时禁用按钮
            className="ml-2"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {gameState === "start" && renderStartScreen()}
      {gameState === "playing" && renderGameScreen()}
      {gameState === "end" && renderEndScreen()}
    </div>
  );
};

export default CommunityPage;

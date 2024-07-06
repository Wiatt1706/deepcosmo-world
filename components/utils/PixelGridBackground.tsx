import { useEffect, useState } from "react";

interface PixelGridBackgroundProps {
  gridSize: number;
  cloudOpacity?: number;
  colors: string[];
  spawnFrequency: number;
  cellDuration: number;
  enableAnimation: boolean;
}

export const PixelGridBackground: React.FC<PixelGridBackgroundProps> = ({
  gridSize,
  cloudOpacity = 0.5,
  colors,
  spawnFrequency,
  cellDuration,
  enableAnimation,
}) => {
  const [activeCells, setActiveCells] = useState<
    { id: number; row: number; col: number; color: string }[]
  >([]);
  const [nextCellId, setNextCellId] = useState(0);

  useEffect(() => {
    if (!enableAnimation) return;

    const gridHeight = Math.ceil(window.innerHeight / gridSize);
    const gridWidth = Math.ceil(window.innerWidth / gridSize);

    const addCell = () => {
      const row = Math.floor(Math.random() * gridHeight);
      const col = Math.floor(Math.random() * gridWidth);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const newCell = { id: nextCellId, row, col, color };

      setActiveCells((prevCells) => [...prevCells, newCell]);
      setNextCellId((prevId) => prevId + 1);

      setTimeout(() => {
        setActiveCells((prevCells) =>
          prevCells.filter((cell) => cell.id !== newCell.id)
        );
      }, cellDuration);
    };

    const intervalId = setInterval(addCell, spawnFrequency);

    return () => clearInterval(intervalId);
  }, [
    gridSize,
    colors,
    spawnFrequency,
    cellDuration,
    enableAnimation,
    nextCellId,
  ]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        style={{
          opacity: cloudOpacity,
        }}
      />
      {activeCells.map(({ id, row, col, color }) => (
        <div
          key={id}
          className="absolute fade-in-out"
          style={{
            top: `${row * gridSize}px`,
            left: `${col * gridSize}px`,
            width: `${gridSize}px`,
            height: `${gridSize}px`,
            backgroundColor: color,
            animationDuration: `${cellDuration}ms`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fade {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .fade-in-out {
          animation-name: fade;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

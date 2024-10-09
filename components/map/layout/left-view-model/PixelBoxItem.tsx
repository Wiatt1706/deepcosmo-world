import { PixelBlock } from "@/types/MapTypes";
import { Image } from "@nextui-org/react";

interface PixelBoxItemProps {
  item: PixelBlock;
  selected: boolean;
  hovered: boolean;
  onClick: () => void;
  onHover?: (key: string | null) => void;
  endContent?: JSX.Element; // Allow custom end content
}

export const PixelBoxItem: React.FC<PixelBoxItemProps> = ({
  item,
  selected,
  hovered,
  onClick,
  onHover,
  endContent,
}) => {
  return (
    <div
      className={`flex items-center justify-between p-2 rounded m-2 ${
        selected && "bg-[#e7e8e8]"
      } cursor-pointer`}
      onClick={onClick}
      onMouseEnter={() => onHover && onHover(item.id)}
      onMouseLeave={() => onHover && onHover(null)}
    >
      <div className="flex items-center text-[14px]">
        <div className="min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] border border hover:border-[#006fef] p-1 m-1 overflow-hidden">
          <Image
            width={64}
            height={64}
            alt="Pixel block Image"
            src={item.landCoverImg || "/images/DefPixel.png"}
            className="object-cover rounded-sm"
          />
        </div>
        <div className="flex flex-col h-[60px] px-2">
          <span className="text-[16px] font-semibold">
            {item.x}，{item.y}
          </span>
          <span>像素块</span>
        </div>
      </div>
      {(hovered || selected) && endContent}
    </div>
  );
};

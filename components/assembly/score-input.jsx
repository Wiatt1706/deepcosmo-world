import { TbStar, TbStarFilled, TbStarHalfFilled } from "react-icons/tb";

export default function ScoreInput({ score }) {
  // 将评分从 0-10 映射到 0-5 范围内
  const normalizedScore = Math.min(Math.max(score / 2, 0), 5);

  // 创建星星数组
  const stars = Array.from({ length: 5 }, (_, index) => {
    // 判断当前星星是否应该是半星、满星还是空星
    if (index < normalizedScore - 0.5) {
      return <TbStarFilled key={index} size={16} />;
    } else if (index < normalizedScore) {
      return <TbStarHalfFilled key={index} size={16} />;
    } else {
      return <TbStar key={index} size={16} />;
    }
  });

  return <div className="flex gap-2 px-2">{stars}</div>;
}

ScoreInput.defaultProps = {
  score: 0,
};

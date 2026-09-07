import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type TileScrollBackgroundProps = {
  /** 背景色 */
  backgroundColor?: string;
  /** 水玉の色 */
  dotColor?: string;
  /** タイル1枚の大きさ（px）。水玉の間隔になる */
  tileSize?: number;
  /** 水玉の半径（px） */
  dotRadius?: number;
  /** スクロール速度（px/秒）。[X, Y] */
  speedPxPerSec?: readonly [number, number];
};

/**
 * 水玉タイルを敷き詰めて、一定速度で斜めにスクロールさせ続けるだけの背景。
 * 中身の主役を邪魔しないよう、模様はごく控えめにしてある。
 * @param param0
 * @param param0.backgroundColor 背景色
 * @param param0.dotColor 水玉の色
 * @param param0.tileSize タイル1枚の大きさ（px）
 * @param param0.dotRadius 水玉の半径（px）
 * @param param0.speedPxPerSec スクロール速度（px/秒）。[X, Y]
 */
export const TileScrollBackground: React.FC<TileScrollBackgroundProps> = ({
  backgroundColor = "#222222",
  dotColor = "rgba(255, 255, 255, 0.6)",
  tileSize = 80,
  dotRadius = 8,
  speedPxPerSec = [12, 18],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsedSec = frame / fps;
  const offsetX = elapsedSec * speedPxPerSec[0];
  const offsetY = elapsedSec * speedPxPerSec[1];

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        backgroundImage: `radial-gradient(circle at center, ${dotColor} ${dotRadius}px, transparent ${dotRadius}px)`,
        backgroundSize: `${tileSize}px ${tileSize}px`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
      }}
    />
  );
};

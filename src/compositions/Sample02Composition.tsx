import {
  AbsoluteFill,
  Composition,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TileScrollBackground } from "../components/TileScrollBackground";
import { WiggleEffect, bounceEffect } from "../effects/WiggleEffect";

type Props = {};

/**
 * Sample02:
 * 画像表示とアニメーション
 * @returns
 */
export const Sample02Composition = () => {
  return (
    <Composition
      id="Sample02"
      component={Sample02Component}
      durationInFrames={120}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

/**
 * 中央のエレキベアに Wiggle と Bounce を効かせ、背景は水玉タイルをスクロールさせるだけのシンプルな構成。
 * 背景（水玉スクロール）＋中央の絵（Wiggle × Bounce）
 * @returns
 */
export const Sample02Component: React.FC<Props> = () => {
  const frame = useCurrentFrame();

  // 主役の絵の表示サイズ（px）
  const imageSize = 480;

  // 一定間隔で 0 → 1 を進み、跳ね終わったら次のサイクルまで待つ
  const bounceCycleFrames = 40;
  const bounceDurtaionFrames = 22;
  const bounceProgress = (frame % bounceCycleFrames) / bounceDurtaionFrames;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/** 背景: 水玉タイルをゆっくり斜めスクロール */}
      <TileScrollBackground />

      {/** 主役: ゆらゆら揺れ続け（Wiggle）、定期的に跳ねる（Bounce） */}
      <WiggleEffect
        rotateDeg={4}
        rotateSec={3}
        offsetPx={[12, 16]}
        scaleAmount={0.03}
      >
        <Img
          src={staticFile("images/elekibear.png")}
          style={{
            width: imageSize,
            height: imageSize,
            objectFit: "contain",
            transform: bounceEffect(bounceProgress, imageSize),
          }}
        />
      </WiggleEffect>
    </AbsoluteFill>
  );
};

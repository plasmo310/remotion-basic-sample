import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TileScrollBackground } from "../components/TileScrollBackground";

type Props = {};

/** 各シーケンスの開始フレームと長さ */
const seq1From = 0;
const seq1Duration = 60;
const seq2From = seq1From + seq1Duration;
const seq2Duration = 60;
const seq3From = seq2From + seq2Duration;
const seq3Duration = 90;

/** キャラクターの表示サイズ（px） */
const characterSize = 400;

/** Sequence3 で二人がぶつかるフレーム（シーケンス内の相対フレーム） */
const impactFrame = 18;

/** テロップの共通スタイル */
const telopStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 60,
  width: "100%",
  textAlign: "center",
  fontFamily: "sans-serif",
  fontSize: 84,
  fontWeight: "bold",
  color: "#ffffff",
  WebkitTextStroke: "8px #222222",
  paintOrder: "stroke fill",
};

/**
 * Sample03:
 * 応用アニメーション (キャラクター同士のかけ合い)
 * @returns
 */
export const Sample03Composition = () => {
  return (
    <Composition
      id="Sample03"
      component={Sample03Component}
      durationInFrames={seq3From + seq3Duration}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

/**
 * エレキベアとゴロヤンの対決アニメーション。
 * 背景の水玉スクロールだけ全編通して流し、中身は3つのSequenceに分けている。
 * @returns
 */
export const Sample03Component: React.FC<Props> = () => {
  return (
    <AbsoluteFill>
      {/** 背景: 水玉タイルを全編通してスクロール */}
      <TileScrollBackground />

      <Sequence
        name="Sequence 1"
        from={seq1From}
        durationInFrames={seq1Duration}
      >
        <Sequence1Component />
      </Sequence>

      <Sequence
        name="Sequence 2"
        from={seq2From}
        durationInFrames={seq2Duration}
      >
        <Sequence2Component />
      </Sequence>

      <Sequence
        name="Sequence 3"
        from={seq3From}
        durationInFrames={seq3Duration}
      >
        <Sequence3Component />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Sequence1: エレキベアが右から登場してズームインし、テロップを出す。
 * @returns
 */
const Sequence1Component: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 右画面外 → 中央へスライドイン
  const slideIn = interpolate(frame, [0, 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const bearX = slideIn * 900;

  // 止まったところからバネでズームイン
  const zoom = spring({
    frame: frame - 18,
    fps,
    durationInFrames: 24,
    config: { damping: 11 },
  });
  const bearScale = 1 + zoom * 0.45;

  // ズームインし切るあたりでテロップを出す
  const telop = interpolate(frame, [30, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img
          src={staticFile("images/elekibear.png")}
          style={{
            width: characterSize,
            height: characterSize,
            objectFit: "contain",
            transform: `translateX(${bearX}px) scale(${bearScale})`,
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          ...telopStyle,
          opacity: telop,
          transform: `translateY(${(1 - telop) * 30}px)`,
        }}
      >
        勝負だクマ！
      </div>
    </AbsoluteFill>
  );
};

/**
 * Sequence2: ゴロヤンが左から登場してズームインし、テロップを出す。
 * @returns
 */
const Sequence2Component: React.FC<Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 左画面外 → 中央へスライドイン
  const slideIn = interpolate(frame, [0, 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const goloX = slideIn * -900;

  // 止まったところからバネでズームイン
  const zoom = spring({
    frame: frame - 18,
    fps,
    durationInFrames: 24,
    config: { damping: 11 },
  });
  const goloScale = 1 + zoom * 0.45;

  // ズームインし切るあたりでテロップを出す
  const telop = interpolate(frame, [30, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Img
          src={staticFile("images/goloyam.png")}
          style={{
            width: characterSize,
            height: characterSize,
            objectFit: "contain",
            transform: `translateX(${goloX}px) scale(${goloScale})`,
          }}
        />
      </AbsoluteFill>
      <div
        style={{
          ...telopStyle,
          opacity: telop,
          transform: `translateY(${(1 - telop) * 30}px)`,
        }}
      >
        ゴロゴロ！（受けてたつ）
      </div>
    </AbsoluteFill>
  );
};

/**
 * Sequence3: エレキベアが右から・ゴロヤンが左から突進し、
 * ぶつかった瞬間にゴロヤンが斜め左へ吹っ飛ぶ。
 * @returns
 */
const Sequence3Component: React.FC<Props> = () => {
  const frame = useCurrentFrame();

  // 助走: 左右の画面外から一定速度で中央へ
  const approach = interpolate(frame, [0, impactFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 吹っ飛び: 衝突後の進行度
  const knockback = interpolate(
    frame,
    [impactFrame, impactFrame + 50],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );

  // エレキベアは右から突進し、ぶつかっても反動を受けずそのまま中央まで進む。
  // 衝突の前後でイージングを挟まず一定速度で動かすことで、勢いを保ったまま突き抜ける。
  const bearX = interpolate(
    frame,
    [0, impactFrame, impactFrame + 4],
    [820, 140, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ゴロヤンは左から突進し、衝突した瞬間から斜め左上へ回転しながら吹っ飛ぶ
  const goloX = interpolate(approach, [0, 1], [-820, -140]) - knockback * 900;
  const goloY = -knockback * 700;
  const goloRotate = -knockback * 900;
  const goloScale = 1 - knockback * 0.55;

  // 衝突の白フラッシュと画面揺れ
  const flash = interpolate(
    frame,
    [impactFrame - 1, impactFrame + 1, impactFrame + 10],
    [0, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shakeAmount = interpolate(
    frame,
    [impactFrame, impactFrame + 14],
    [26, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const shakeX =
    frame >= impactFrame
      ? Math.sin((frame - impactFrame) * 1.7) * shakeAmount
      : 0;
  const shakeY =
    frame >= impactFrame
      ? Math.cos((frame - impactFrame) * 2.3) * shakeAmount
      : 0;

  // ゴロヤンを吹っ飛ばした瞬間に「WIN」のテロップを出す
  const winFrom = impactFrame;
  const telop = interpolate(frame, [winFrom, winFrom + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        <Img
          src={staticFile("images/elekibear.png")}
          style={{
            width: characterSize,
            height: characterSize,
            objectFit: "contain",
            position: "absolute",
            transform: `translateX(${bearX}px)`,
          }}
        />
        <Img
          src={staticFile("images/goloyam.png")}
          style={{
            width: characterSize,
            height: characterSize,
            objectFit: "contain",
            position: "absolute",
            transform: `translate(${goloX}px, ${goloY}px) rotate(${goloRotate}deg) scale(${goloScale})`,
          }}
        />
      </AbsoluteFill>

      {/** 激突の瞬間の白フラッシュ */}
      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: flash }} />

      {/** 決着後のWIN表示 */}
      <div
        style={{
          ...telopStyle,
          opacity: telop,
          transform: `translateY(${(1 - telop) * 30}px)`,
        }}
      >
        WIN
      </div>
    </AbsoluteFill>
  );
};

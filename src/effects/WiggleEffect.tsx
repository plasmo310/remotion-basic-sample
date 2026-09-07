import { useCurrentFrame, useVideoConfig } from "remotion";
import { loopMotionEffect } from "./LoopMotionEffect";

/** 揺らし方の上書き。省略した項目は既定値が使われる */
export type WiggleOptions = {
  /** 反復回転の振れ幅（度）。左右にこの角度だけ往復する。省略時 0（回転なし） */
  rotateDeg?: number;
  /** 回転が1往復するのにかかる秒数。省略時 4 */
  rotateSec?: number;
  /** ゆっくりオフセット移動の振れ幅（px）。[X, Y]。省略時 [0, 0]（移動なし） */
  offsetPx?: readonly [number, number];
  /**
   * オフセット移動が1往復するのにかかる秒数。[X, Y]。省略時 [5, 7]。
   * X と Y で周期をずらすと、往復ではなく楕円っぽく漂って見える
   */
  offsetSec?: readonly [number, number];
  /**
   * ゆっくり伸縮する量（拡大率の振れ幅）。
   * 0.05 なら等倍を中心に 0.95〜1.05 を往復する。省略時 0（伸縮なし）
   */
  scaleAmount?: number;
  /** 伸縮が1往復するのにかかる秒数。省略時 4 */
  scaleSec?: number;
};

type WiggleEffectProps = WiggleOptions & {
  /**
   * ラッパー要素に足すスタイル。位置・大きさの指定に使う。
   * transform はこのコンポーネントが上書きするので指定しないこと
   */
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 * 中身をゆっくり反復回転＋オフセット移動＋伸縮させ続けるラッパー。
 * ロゴや飾りを「置いてあるだけ」に見せず、わずかに揺らして生かすのに使う。
 * 変形の軸はラッパーの中央（transform-origin の既定）。
 * @param param0
 * @param param0.rotateDeg 反復回転の振れ幅（度）。0 で回転なし
 * @param param0.rotateSec 回転が1往復するのにかかる秒数
 * @param param0.offsetPx ゆっくりオフセット移動の振れ幅（px）。[X, Y]。0 で移動なし
 * @param param0.offsetSec オフセット移動が1往復するのにかかる秒数。[X, Y]
 * @param param0.scaleAmount ゆっくり伸縮する量（拡大率の振れ幅）。0 で伸縮なし
 * @param param0.scaleSec 伸縮が1往復するのにかかる秒数
 * @param param0.style ラッパー要素に足すスタイル（位置・大きさ）
 * @param param0.children 揺らす中身
 */
export const WiggleEffect = ({
  rotateDeg = 0,
  rotateSec = 4,
  offsetPx = [0, 0],
  offsetSec = [5, 7],
  scaleAmount = 0,
  scaleSec = 4,
  style,
  children,
}: WiggleEffectProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsedSec = frame / fps;
  const rotate = loopMotionEffect.oscillate(elapsedSec, rotateSec) * rotateDeg;
  const offsetX =
    loopMotionEffect.oscillate(elapsedSec, offsetSec[0]) * offsetPx[0];
  const offsetY =
    loopMotionEffect.oscillate(elapsedSec, offsetSec[1]) * offsetPx[1];
  const scale =
    1 + loopMotionEffect.oscillate(elapsedSec, scaleSec) * scaleAmount;

  return (
    <div
      style={{
        ...style,
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg) scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
};

/** 跳ね方の上書き。省略した項目は既定値が使われる */
export type BounceOptions = {
  /** 持ち上げる量（絵の表示サイズに対する比率）。省略時 0.04 */
  liftRatio?: number;
  /** 縦に伸ばす量（比率）。省略時 0.03。伸ばした分だけ横を縮める */
  stretchRatio?: number;
};

/**
 * 一度だけ跳ねる変形の transform 文字列を作る。
 * 0 → 1 → 0 の山カーブ本体は loopMotionEffect.bump が返し、
 * ここではそれを「持ち上げ＋伸縮」の transform に組み立てるだけ。
 * @param progress 跳ね始めてからの進み具合（0 で跳ね始め、1 で跳ね終わり）
 * @param sizePx 跳ねる絵の表示サイズ（px）
 * @param options 跳ね方の上書き
 * @param options.liftRatio 持ち上げる量（絵の表示サイズに対する比率）
 * @param options.stretchRatio 縦に伸ばす量（比率）。伸ばした分だけ横を縮める
 */
export const bounceEffect = (
  progress: number,
  sizePx: number,
  options: BounceOptions = {},
): string => {
  const liftRatio = options.liftRatio ?? 0.04;
  const stretchRatio = options.stretchRatio ?? 0.03;

  // 跳ね終わったあとは bump が 0 を返すので、コマが長く居座っても動きっぱなしにならない
  const bounce = loopMotionEffect.bump(progress);

  return `translateY(${-bounce * sizePx * liftRatio}px) scale(${
    1 - bounce * stretchRatio
  }, ${1 + bounce * stretchRatio})`;
};

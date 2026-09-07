/** 跳ね方の上書き。省略した項目は既定値が使われる */
export type BounceOptions = {
  /** 持ち上げる量（絵の表示サイズに対する比率）。省略時 0.04 */
  liftRatio?: number;
  /** 縦に伸ばす量（比率）。省略時 0.03。伸ばした分だけ横を縮める */
  stretchRatio?: number;
};

/**
 * 0 → 1 → 0 と一度だけ山を描く半サイン波（progress 0.5 で頂点）。
 * 山の外（0 以下・1 以上）はぴったり 0 を返すので、
 * 山を越えたあと動きっぱなしにならない
 * @param progress 進み具合（0 → 1）
 */
const bump = (progress: number): number =>
  progress > 0 && progress < 1 ? Math.sin(progress * Math.PI) : 0;

/**
 * 一度だけ跳ねる変形の transform 文字列を作る。
 * 0 → 1 → 0 の山カーブ本体は bump が返し、
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
  const bounce = bump(progress);

  return `translateY(${-bounce * sizePx * liftRatio}px) scale(${
    1 - bounce * stretchRatio
  }, ${1 + bounce * stretchRatio})`;
};

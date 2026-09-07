import { AbsoluteFill, Composition, Sequence } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { SimpleBackground } from "../components/SimpleBackground";

type Props = {};

/**
 * Sample01:
 * Sequence遷移とトランジション
 * @returns
 */
export const Sample01Composition = () => {
  return (
    <Composition
      id="Sample01"
      component={Sample01Component}
      durationInFrames={110}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

/**
 * Sequence遷移とトランジションの設定
 * @returns
 */
export const Sample01Component: React.FC<Props> = () => {
  return (
    <>
      {/** Sequence1-3: シンプルなSequence切り替え */}
      <AbsoluteFill>
        <Sequence name="Sequence 1" durationInFrames={20}>
          <SimpleBackground backgroundColor="#2563eb" text="Sequence 1" />
        </Sequence>
        <Sequence name="Sequence 2" from={20} durationInFrames={20}>
          <SimpleBackground backgroundColor="#eb2556" text="Sequence 2" />
        </Sequence>
        <Sequence name="Sequence 3" from={40} durationInFrames={20}>
          <SimpleBackground backgroundColor="#ebcd25" text="Sequence 3" />
        </Sequence>
      </AbsoluteFill>

      {/** Sequence4-6: TransitionSeriesによるTransition付与 */}
      <TransitionSeries from={60}>
        <TransitionSeries.Sequence name="Sequence 4" durationInFrames={20}>
          <SimpleBackground backgroundColor="#7c3aed" text="Sequence 4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: 5 })}
        />
        <TransitionSeries.Sequence name="Sequence 5" durationInFrames={20}>
          <SimpleBackground backgroundColor="#db2777" text="Sequence 5" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 5 })}
        />
        <TransitionSeries.Sequence name="Sequence 6" durationInFrames={20}>
          <SimpleBackground backgroundColor="#059669" text="Sequence 6" />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};

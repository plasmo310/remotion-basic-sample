import { AbsoluteFill, Interactive } from "remotion";

type SimpleBackgroundProps = {
  backgroundColor: string;
  text: string;
  textColor?: string;
};

/**
 * 背景色とテキストを受け取って表示するだけのComponent
 * @param param0
 * @param param0.backgroundColor 背景色
 * @param param0.text 中央に表示するテキスト
 * @param param0.textColor テキストの色。省略時 "white"
 * @returns
 */
export const SimpleBackground: React.FC<SimpleBackgroundProps> = ({
  backgroundColor,
  text,
  textColor = "white",
}) => {
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        backgroundColor,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Interactive.Div
        name="Centered text"
        style={{
          color: textColor,
          fontSize: 100,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        {text}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

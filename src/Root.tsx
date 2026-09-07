import { Sample01Composition } from "./compositions/Sample01Composition";
import { Sample02Composition } from "./compositions/Sample02Composition";
import { Sample03Composition } from "./compositions/Sample03Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Sample01Composition />
      <Sample02Composition />
      <Sample03Composition />
    </>
  );
};

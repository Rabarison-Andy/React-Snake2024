import useStore from "../../utils/store";
import s from "./MirrorSnake.module.scss";

const MirrorSnake = ({ data, boardSize }) => {
  const baseSize = 500;
  const adjustedSize = baseSize * boardSize;

  const getMirroredPosition = (position) => {
    return [adjustedSize - position[0] - 10, adjustedSize - position[1] - 10];
  };

  return (
    <>
      {data.map((dot, i) => {
        const mirroredPosition = getMirroredPosition(dot);
        return (
          <div
            key={`mirror-${i}`}
            className={s.mirrorSnakeDot}
            style={{
              transform: `translate(${mirroredPosition[0]}px, ${mirroredPosition[1]}px)`,
            }}
          />
        );
      })}
    </>
  );
};

export default MirrorSnake; 